// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract VotingSystem {
    struct Event {
        uint256 eventId;
        string eventName;
        uint256 categoryId;
        Candidate[] candidates;
        uint256 candidateCount;
    }

    struct Category {
        uint256 categoryId;
        string categoryName;
        Event[] events; //category has many event
    }

    struct Candidate {
        uint256 id;
        string name;
        uint256 CategoryId;
        uint256 eventId;
        uint256 voteCount;
    }

    struct voteEventStruct {
        uint256 id;
        uint256 voterId;
        uint256 categoryId;
        uint256 eventId;
        bool voted;
    }

    event CategoryAdded(uint256 indexed categoryId, string categoryName);
    event EventAdded(uint256 indexed eventId, string eventName);
    event CandidateAdded(uint256 indexed eventId, string eventName);

    mapping(uint256 => Category) categories;
    mapping(uint256 => Event) events;
    mapping(uint256 => Candidate) candidates;
    mapping(uint256 => voteEventStruct) public voteEvents;

    uint256 categoryCount;
    uint256 candidateCount;
    uint256 eventCount;
    uint256 voteEventCount;

    event VoteEvent(
        uint256 indexed voterId,
        string indexed categoryEvent,
        uint256 indexed candidate
    );

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

        // emit the category added event
        emit CategoryAdded(categoryCount, _categoryName);
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

        // // Add candidates to the event
        // for (uint256 i = 0; i < _candidateNames.length; i++) {
        //     string memory candidateName = _candidateNames[i];
        //     candidateCount += 1;
        //     // Create a new candidate
        //     Candidate memory newCandidate = Candidate({
        //         id: candidateCount,
        //         name: candidateName,
        //         CategoryId: _categoryId,
        //         eventName: _eventName,
        //         voteCount: 0
        //     });
        //     // Push the new candidate to the candidates array
        //     candidates[candidateCount] = newCandidate;
        //     listEvent.candidates.push(newCandidate);
        //     newEvent.candidates.push(newCandidate);
        // }
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

    function addCandidateToEvent(
        uint256 _categoryId,
        uint256 _eventId,
        string memory _candidateName
    ) public {
        require(
            categories[_categoryId].categoryId != 0,
            "Category has not exists"
        );

        require(
            isEventExists(_categoryId, _eventId) == true,
            "Event has not exists"
        );

        candidateCount += 1;
        // Create a new candidate
        Candidate memory newCandidate = Candidate({
            id: candidateCount,
            name: _candidateName,
            CategoryId: _categoryId,
            eventId: _eventId,
            voteCount: 0
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
        returns (string[] memory foundEvent)
    {
        // find the certain category
        Category storage category = categories[_categoryId];

        // declare an array variable for storing events
        string[] memory eventsName = new string[](category.events.length);

        // get all the event name by searching the event in list
        for (uint256 i = 0; i < category.events.length; i++) {
            eventsName[i] = category.events[i].eventName;
        }

        return (eventsName);
    }

    function getAllCategoryEventCandidate(
        uint256 _categoryId,
        string memory _eventName
    ) public view returns (string[] memory candidatesFound) {
        // find the certain category
        Category storage category = categories[_categoryId];
        // find the certain event in certain category
        for (uint256 i = 0; i < category.events.length; i++) {
            if (
                keccak256(bytes(category.events[i].eventName)) ==
                keccak256(bytes(_eventName))
            ) {
                string[] memory candidatesName = new string[](
                    category.events[i].candidateCount
                );

                for (
                    uint256 j = 0;
                    j < category.events[i].candidates.length;
                    j++
                ) {
                    candidatesName[j] = category.events[i].candidates[j].name;
                }
                return (candidatesName);
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
        Category memory categoriesFound;
        // Iterate through all stored structs
        for (uint256 i = 1; i <= categoryCount; i++) {
            if (categories[i].categoryId == _categoryId) {
                categoriesFound = categories[i];
            }
        }

        return categoriesFound;
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

    function vote(
        uint256 _voterId,
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

        require(candidates[_candidateId].id != 0, "Candidates does not exists");

        // check if has voted
        for (uint256 i = 1; i <= voteEventCount; i++) {
            if (
                _voterId == voteEvents[i].voterId &&
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
            voterId: _voterId,
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

        emit VoteEvent(_voterId, concatenatedValues, _candidateId);
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

        // If the event is not found, return an empty array or handle the situation accordingly
        return winner;
    }
}
