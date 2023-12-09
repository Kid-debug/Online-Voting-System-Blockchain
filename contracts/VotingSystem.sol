// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract VotingSystem {
    address public owner;
    struct Voter {
        uint256 id;
        string key;
        string email;
        bytes32 password;
        string role;
        uint256 status; // 0: no verify, 1: verified, 2:banned
        string token;
    }

    struct Event {
        uint256 eventId;
        string eventName;
        uint256 categoryId;
        Candidate[] candidates;
        uint256 candidateCount;
        uint256 status; // 1: Upcoming, 2: In Progress, 3: Completed, 4： Cancel
    }

    struct Category {
        uint256 categoryId;
        string categoryName;
        Event[] events; //category has many event
        uint256 status;
    }

struct Candidate {
        uint256 id;
        string name;
        string description;
        uint256 studentId;
        uint256 categoryId;
        uint256 eventId;
        uint256 voteCount;
        bool win;
        string imageFileName;
    }

    struct voteEventStruct {
        uint256 id;
        string voterKey;
        uint256 categoryId;
        uint256 eventId;
        bool voted;
    }

    event CategoryAdded(uint256 indexed categoryId, string categoryName);

    event VoterAdded(uint256 indexed voterId, string voter_key);
    event EventAdded(uint256 indexed eventId, string eventName);

    event CandidateAdded(uint256 indexed eventId, string eventName);

    event VoteEvent(
        string indexed _voterKey,
        string indexed categoryEvent,
        uint256 indexed candidate
    );

    mapping(uint256 => Category) categories;
    mapping(uint256 => Event) events;
    mapping(uint256 => Candidate) candidates;
    mapping(uint256 => voteEventStruct) public voteEvents;
    mapping(uint256 => Voter) public voters;
    mapping(string => bool) private usedImageFileNames;

    uint256 categoryCount;
    uint256 candidateCount;
    uint256 eventCount;
    uint256 voteEventCount;
    uint256 voterCount;

    constructor() {
        owner = msg.sender;
    }

    function addVoter(
        string memory _key,
        string memory _email,
        string memory _password,
        string memory _role,
        string memory _token
    ) public {
        for (uint256 i = 1; i <= voterCount; i++) {
            require(
                keccak256(bytes(_key)) != keccak256(bytes(voters[i].key)),
                "Voter already exists"
            );
        }

        // total category plus 1, use it as the category's id
        voterCount += 1;

        bytes32 hashedPassword = keccak256(abi.encodePacked(_password));

        // add the category details in the category list
        Voter storage voter = voters[voterCount];
        voter.id = voterCount;
        voter.key = _key;
        voter.email = _email;
        voter.password = hashedPassword;
        voter.role = _role;
        voter.status = 0;
        voter.token = _token;

        // emit the category added event
        emit VoterAdded(voterCount, _key);
    }

    function loginVoter(string memory _email, string memory _password)
        public
        view
        returns (Voter memory)
    {
        Voter memory voterFound = getVoterByEmailPassword(_email, _password);
        require(voterFound.id != 0, "Your email or password is incorrect!");
        require(
            voterFound.status == 1,
            "Your account was banned or not verify!"
        );
        return voterFound;
    }

    function compareHashesPassword(bytes32 inputPassword, bytes32 password)
        internal
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < 32; i++) {
            if (inputPassword[i] != password[i]) {
                return false;
            }
        }
        return true;
    }

    function getVoterByEmailPassword(
        string memory _email,
        string memory _password
    ) public view returns (Voter memory) {
        bytes32 hashedPassword = keccak256(abi.encodePacked(_password));
        for (uint256 i = 1; i <= voterCount; i++) {
            if (
                keccak256(bytes(_email)) == keccak256(bytes(voters[i].email)) &&
                compareHashesPassword(hashedPassword, voters[i].password)
            ) {
                return voters[i];
            }
        }

        // Event not found in the specified category
        return Voter(0, "", "", "", "", 0, "");
    }

    function getVoterEmailById(uint256 _voterId) public view returns (string memory) {
    require(_voterId > 0 && _voterId <= voterCount, "Invalid voter ID");
    return voters[_voterId].email;
    }


    function updateVoterPassword(string memory _key, string memory _password)
        public
    {
        require(isVoterExist(_key), "User does not exists");

        bytes32 hashedPassword = keccak256(abi.encodePacked(_password));
        for (uint256 i = 1; i <= voterCount; i++) {
            if (keccak256(bytes(_key)) == keccak256(bytes(voters[i].key))) {
                voters[i].password = hashedPassword;
            }
        }
    }

    function verifyVoterAccount(string memory _token) public returns (bool) {
        require(voters[1].id != 0, "No voter in the list!");
        for (uint256 i = 1; i <= voterCount; i++) {
            if (keccak256(bytes(_token)) == keccak256(bytes(voters[i].token))) {
                voters[i].status = 1;
                return true;
            }
        }
        return false;
    }

    function getVoterStatus(string memory _email, string memory _password)
        public
        view
        returns (uint256 status)
    {
        Voter memory voterFound = getVoterByEmailPassword(_email, _password);
        require(voterFound.id != 0, "Your email or password is incorrect!");
        return voterFound.status;
    }

    function checkVoterEmailPassword(
        string memory _email,
        string memory _password
    ) public view returns (bool foundVoter) {
        Voter memory voterFound = getVoterByEmailPassword(_email, _password);

        if (voterFound.id != 0) {
            return true;
        }
        return false;
    }

    function isVoterExist(string memory _key) public view returns (bool) {
        for (uint256 i = 1; i <= voterCount; i++) {
            if (keccak256(bytes(_key)) == keccak256(bytes(voters[i].key))) {
                return true;
            }
        }
        return false;
    }

    function addCategory(string memory _categoryName) public {
        // check if the category is exist
        for (uint256 i = 1; i <= categoryCount; i++) {
            require(
                keccak256(bytes(_categoryName)) !=
                    keccak256(bytes(categories[i].categoryName)),
                "Category already exists"
            );
        }

        // total category plus 1, use it as the category's id
        categoryCount += 1;

        // add the category details in the category list
        Category storage category = categories[categoryCount];
        category.categoryName = _categoryName;
        category.categoryId = categoryCount;
        category.status = 1;

        // emit the category added event
        emit CategoryAdded(categoryCount, _categoryName);
    }

    function updateCategory(Category memory _category) public {
        // check if the category is exist
        require(
            categories[_category.categoryId].categoryId != 0,
            "Category has not exists"
        );

        // add the category details in the category list
        Category storage category = categories[_category.categoryId];
        category.categoryName = _category.categoryName;
        category.status = _category.status;
    }

    function addEvent(uint256 _categoryId, string memory _eventName) public {
        // check if the category has exists
        require(
            categories[_categoryId].categoryId != 0,
            "Category has not exists"
        );

        require(
            isEventExists(_categoryId, _eventName) == false,
            "Event already exists"
        );

        // find out the category in list by using the paramerter category name
        Category storage category = categories[_categoryId];

        // add the event in the category list
        uint256 eventId = eventCount += 1;

        Event storage newEvent = category.events.push();
        newEvent.eventId = eventId;
        newEvent.eventName = _eventName;
        newEvent.categoryId = _categoryId;
        newEvent.status = 1;
    }

    function isEventExists(uint256 _categoryId, string memory _eventName)
        public
        view
        returns (bool)
    {
        // Check if the category exists
        require(
            categories[_categoryId].categoryId != 0,
            "Category does not exist"
        );

        // Loop through the events in the specified category
        for (uint256 i = 0; i < categories[_categoryId].events.length; i++) {
            if (
                keccak256(bytes(categories[_categoryId].events[i].eventName)) ==
                keccak256(bytes(_eventName))
            ) {
                // Event found
                return true;
            }
        }

        // Event not found in the specified category
        return false;
    }

    function updateEvent(Event memory _event) public {
        // check if the category is exist
        require(
            categories[_event.categoryId].categoryId != 0,
            "Category does not exists"
        );
        require(
            isEventExists(_event.categoryId, _event.eventId),
            "Event does not exist!"
        );
        // add the category details in the category list
        Event storage eventToUpdate = categories[_event.categoryId].events[
            _event.eventId - 1
        ];

        eventToUpdate.eventName = _event.eventName;
        eventToUpdate.status = _event.status;
    }

     function addCandidateToEvent(
        uint256 _categoryId,
        uint256 _eventId,
        string memory _candidateName,
        string memory _description,
        uint256 _studentId,
        string memory _imageFileName
    ) public {
        require(
            categories[_categoryId].categoryId != 0,
            "Category does not exist"
        );
        require(
            isEventExists(_categoryId, _eventId),
            "Event does not exist"
        );
        require(
            !isCandidateExistsInEvent(_categoryId, _eventId, _studentId),
            "Candidate already exists"
        );
        // Check if the image file name is already used
        require(
            !usedImageFileNames[_imageFileName],
            "Image file name already in use"
        );

        candidateCount += 1;

        // Create a new candidate
        Candidate memory newCandidate = Candidate({
            id: candidateCount,
            name: _candidateName,
            studentId: _studentId,
            categoryId: _categoryId,
            eventId: _eventId,
            description: _description,
            win: false,
            voteCount: 0,
            imageFileName: _imageFileName
        });

        // find the certain category
        Category storage category = categories[_categoryId];
        // find the certain event in certain category
        for (uint256 i = 0; i < category.events.length; i++) {
            if (category.events[i].eventId == _eventId) {
                category.events[i].candidates.push(newCandidate);
                category.events[i].candidateCount += 1;
            }
        }

        // Mark the image file name as used
        usedImageFileNames[_imageFileName] = true;
    }

    function updateCandidate(Candidate memory _candidate) public {
        require(
            categories[_candidate.categoryId].categoryId != 0,
            "Category has not exists"
        );

        require(
            isEventExists(_candidate.categoryId, _candidate.eventId) == true,
            "Event has not exists"
        );

        require(
            isCandidateExistsInEvent(
                _candidate.categoryId,
                _candidate.eventId,
                _candidate.studentId
            ) == true,
            "Candidate does not existed"
        );

        Candidate storage candidateToUpdate = categories[_candidate.categoryId]
            .events[_candidate.eventId - 1]
            .candidates[_candidate.id - 1];

        candidateToUpdate.name = _candidate.name;
        candidateToUpdate.studentId = _candidate.studentId;
        candidateToUpdate.description = _candidate.description;
    }

    function isImageFileNameUsed(string memory _imageFileName) public view returns (bool) {
        return usedImageFileNames[_imageFileName];
    }

    function isCandidateExistsInEvent(
        uint256 _categoryId,
        uint256 _eventId,
        uint256 _studentId
    ) public view returns (bool) {
        // Check if the category exists
        require(
            categories[_categoryId].categoryId != 0,
            "Category does not exist"
        );

        Candidate[] memory candidatesFound = getAllCandidatesInEvent(
            _categoryId,
            _eventId
        );

        // Loop through the events in the specified category

        for (uint256 i = 0; i < candidatesFound.length; i++) {
            if (candidatesFound[i].studentId == _studentId) {
                return true;
            }
        }

        // Event not found in the specified category
        return false;
    }

    function isCandidateExistsInEventById(
        uint256 _categoryId,
        uint256 _eventId,
        uint256 _candidateId
    ) public view returns (bool) {
        // Check if the category exists
        require(
            categories[_categoryId].categoryId != 0,
            "Category does not exist"
        );

        Candidate[] memory candidatesFound = getAllCandidatesInEvent(
            _categoryId,
            _eventId
        );

        // Loop through the events in the specified category

        for (uint256 i = 0; i < candidatesFound.length; i++) {
            if (candidatesFound[i].id == _candidateId) {
                return true;
            }
        }

        // Event not found in the specified category
        return false;
    }

    function isEventExists(uint256 _categoryId, uint256 _eventId)
        public
        view
        returns (bool)
    {
        // Check if the category exists
        require(
            categories[_categoryId].categoryId != 0,
            "Category does not exist"
        );

        // Loop through the events in the specified category
        for (uint256 i = 0; i < categories[_categoryId].events.length; i++) {
            if (categories[_categoryId].events[i].eventId == _eventId) {
                // Event found
                return true;
            }
        }

        // Event not found in the specified category
        return false;
    }

    function getAllCategoryEvent(uint256 _categoryId)
        public
        view
        returns (Event[] memory foundEvent)
    {
        // find the certain category
        Category storage category = categories[_categoryId];

        // declare an array variable for storing events
        Event[] memory eventsFound = new Event[](category.events.length);

        // get all the event name by searching the event in list
        for (uint256 i = 0; i < category.events.length; i++) {
            eventsFound[i] = category.events[i];
        }

        return (eventsFound);
    }

    function getAllCandidatesInEvent(uint256 _categoryId, uint256 _eventId)
        public
        view
        returns (Candidate[] memory foundCandidates)
    {
        // find the certain category
        Category storage category = categories[_categoryId];
        // find the certain event in certain category
        for (uint256 i = 0; i < category.events.length; i++) {
            if (category.events[i].eventId == _eventId) {
                Candidate[] memory candidatesFound = new Candidate[](
                    category.events[i].candidateCount
                );

                for (
                    uint256 j = 0;
                    j < category.events[i].candidates.length;
                    j++
                ) {
                    candidatesFound[j] = category.events[i].candidates[j];
                }
                return (candidatesFound);
            }
        }
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory candidatesFound = new Candidate[](candidateCount);
        Event[] memory eventFound = new Event[](eventCount);

        // get all the events
        eventFound = getAllEvent();
        uint256 count = 0;
        // find the candidates inside all the event
        for (uint256 i = 0; i < eventCount; i++) {
            for (uint256 j = 0; j < eventFound[i].candidates.length; j++) {
                candidatesFound[count] = eventFound[i].candidates[j];
                count += 1;
            }
        }

        return candidatesFound;
    }

    function getAllCategory() public view returns (Category[] memory) {
        //Candidate[] memory candidatesFound = new Candidate[](candidateCount);
        Category[] memory categoriesFound = new Category[](categoryCount);
        // Iterate through all stored structs
        for (uint256 i = 1; i <= categoryCount; i++) {
            categoriesFound[i - 1] = categories[i];
        }

        return categoriesFound;
    }

    function getCategoryById(uint256 _categoryId)
        public
        view
        returns (Category memory)
    {
        return categories[_categoryId];
    }

    function getAllEvent() public view returns (Event[] memory) {
        // Initialize the array with the correct size
        Event[] memory eventFound = new Event[](eventCount);
        uint256 count = 0;

        // Iterate through all categories and events
        for (uint256 i = 0; i < categoryCount; i++) {
            for (uint256 j = 0; j < categories[i + 1].events.length; j++) {
                eventFound[count] = categories[i + 1].events[j];
                count += 1;
            }
        }

        return eventFound;
    }

    function getEventById(uint256 _categoryId, uint256 _eventId)
        public
        view
        returns (Event memory)
    {
        Category memory categoriesFound = categories[_categoryId];
        Event memory eventFound;
        // Iterate through all stored structs
        for (uint256 i = 0; i < categoriesFound.events.length; i++) {
            if (categoriesFound.events[i].eventId == _eventId) {
                eventFound = categoriesFound.events[i];
            }
        }

        return eventFound;
    }

    function vote(
        string memory _voterKey,
        uint256 _candidateId,
        uint256 _categoryId,
        uint256 _eventId
    ) external {
        require(
            categories[_categoryId].categoryId != 0,
            "Category does not exists"
        );

        require(eventCount != 0, "Event does not exists");

        // for (uint256 i = 1; i <= categories[_categoryId].events.length; i++) {
        //     require(categories[_categoryId].events[i-0].eventId == _eventId, "noobbbbb");
        // }

        require(
            isCandidateExistsInEventById(_categoryId, _eventId, _candidateId) ==
                true,
            "Candidates does not exists"
        );

        // check if has voted
        for (uint256 i = 1; i <= voteEventCount; i++) {
            if (
                 keccak256(bytes(_voterKey)) ==  keccak256(bytes(voteEvents[i].voterKey)) &&
                _categoryId == voteEvents[i].categoryId &&
                _eventId == voteEvents[i].eventId
            ) {
                require(!voteEvents[i].voted, "You already voted");
                break;
            }
        }

        // add count on the candidate
        voteEventCount += 1;

        // Create a new voteEventStruct
        voteEventStruct memory newVoteEvent = voteEventStruct({
            id: voteEventCount,
            voterKey: _voterKey,
            categoryId: _categoryId,
            eventId: _eventId,
            voted: true
        });

        voteEvents[voteEventCount] = newVoteEvent;

        // add the vote count of the chosen candidate
        addVoteCount(_candidateId);
        addVoteCountIn(_categoryId, _eventId, _candidateId);

        string memory concatenatedValues = string(
            abi.encodePacked(_categoryId, _eventId)
        );

        emit VoteEvent(_voterKey, concatenatedValues, _candidateId);
    }

    function addVoteCount(uint256 _candidateId) internal {
        candidates[_candidateId].voteCount += 1;
    }

    function addVoteCountIn(
        uint256 _categoryId,
        uint256 _eventId,
        uint256 _candidateId
    ) internal {
        // get the events inside the categories
        Event[] storage eventsFound = categories[_categoryId].events;

        // find the event with param
        for (uint256 i = 0; i < eventsFound.length; i++) {
            if (eventsFound[i].eventId == _eventId) {
                // get the candidate inside the event
                Candidate[] storage candidatesFound = eventsFound[i].candidates;
                // find the candidate
                for (uint256 j = 0; j < candidatesFound.length; j++) {
                    if (candidatesFound[j].id == _candidateId) {
                        // found the candidate and plus 1 at the voteCount
                        candidatesFound[j].voteCount += 1;
                        break;
                    }
                }
            }
        }
    }

    function getCandidateVoteCount(uint256 _candidateId)
        public
        view
        returns (uint256 count)
    {
        return candidates[_candidateId].voteCount;
    }

    function getVoteEventCandidate(uint256 _categoryId, uint256 _eventId)
        public
        view
        returns (Candidate[] memory)
    {
        Event[] memory eventsFound = categories[_categoryId].events;

        for (uint256 i = 0; i < eventsFound.length; i++) {
            if (eventsFound[i].eventId == _eventId) {
                return eventsFound[i].candidates;
            }
        }

        // If the event is not found, return an empty array or handle the situation accordingly
        return new Candidate[](0);
    }

    function whoIsTheWinner(uint256 _categoryId, uint256 _eventId)
        public
        view
        returns (Candidate memory)
    {
        Event[] memory eventsFound = categories[_categoryId].events;
        Candidate[] memory candidatesFound;

        for (uint256 i = 0; i < eventsFound.length; i++) {
            if (eventsFound[i].eventId == _eventId) {
                candidatesFound = eventsFound[i].candidates;
            }
        }

        Candidate memory winner = candidatesFound[0];

        for (uint256 i = 0; i < candidatesFound.length - 1; i++) {
            if (winner.voteCount < candidatesFound[i + 1].voteCount) {
                winner = candidatesFound[i + 1];
            }
        }

        winner.win = true;

        // If the event is not found, return an empty array or handle the situation accordingly
        return winner;
    }
}
