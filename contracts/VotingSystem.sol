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
        uint256 startDateTime;
        uint256 endDateTime;
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

    struct ResetPassword {
        string email;
        string token;
        uint256 code;
        uint256 createdTime;
    }

    struct voteEventStruct {
        uint256 id;
        string voterKey;
        uint256 categoryId;
        uint256 eventId;
        uint256 votedCandidateId;
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
    mapping(string => ResetPassword) public resetPasswords;

    uint256 categoryCount;
    uint256 candidateCount;
    uint256 eventCount;
    uint256 voteEventCount;
    uint256 voterCount;

    constructor() {
        owner = msg.sender;
        addAdmin("superadmin@gmail.com", "SuperAdmin!123", "S");
    }

    function addResetPasswordRequest(string memory _email, string memory _token, uint256 _code) public {
        // Create and store the new reset password request
        resetPasswords[_email] = ResetPassword({
            email: _email,
            token: _token,
            code: _code,
            createdTime: block.timestamp // Use the current block timestamp
        });
    }

    function isRecentResetRequest(string memory _email) public view returns (bool) {
        ResetPassword memory request = resetPasswords[_email];
        if (request.createdTime == 0) {
            return false; // No request exists
        }
        uint256 age = block.timestamp - request.createdTime;
        return age < 24 hours;
    }

    function isResetPasswordTokenValid(string memory _token) public view returns (bool, string memory) {
        // Ensure the token string is not empty
        require(bytes(_token).length > 0, "Token is empty");

        // Iterate through all reset password requests
        for (uint256 i = 1; i <= voterCount; i++) {
            // Check if the token matches and is not expired (24 hours validity)
            if (keccak256(bytes(resetPasswords[voters[i].email].token)) == keccak256(bytes(_token))
                && (block.timestamp - resetPasswords[voters[i].email].createdTime) < 24 hours) {
                return (true, voters[i].email); // Valid token found
            }
        }
        // No valid token found, return false and empty string
        return (false, "");
    }

    function isVerificationCodeValid(uint256 _userInputCode) public view returns (bool) {
        // Iterate through all reset password requests
        for (uint256 i = 1; i <= voterCount; i++) {
            ResetPassword memory resetRequest = resetPasswords[voters[i].email];
            // Check if the input code matches the stored code and the request is not expired
            if (resetRequest.code == _userInputCode && (block.timestamp - resetRequest.createdTime) < 24 hours) {
                return true; // Verification code is valid and not expired
            }
        }
        return false; // No valid verification code found
    }

    function updateUserPassword(string memory _email, string memory _password) public {
        require(checkUserExistByEmail(_email), "User does not exist.");

        // Ensure there is a recent reset password request
        require(isRecentResetRequest(_email), "No recent reset request found.");

        bytes32 hashedPassword = keccak256(abi.encodePacked(_password));
        for (uint256 i = 1; i <= voterCount; i++) {
            if (keccak256(bytes(_email)) == keccak256(bytes(voters[i].email))) {
                voters[i].password = hashedPassword;

                // Delete the reset password request after updating the password
                delete resetPasswords[_email];
            }
        }
    }

    function addAdmin(
        string memory _email,
        string memory _password,
        string memory _role
    ) public {
        // Check if the admin with the given email already exists
        for (uint256 i = 1; i <= voterCount; i++) {
            require(
                keccak256(bytes(_email)) != keccak256(bytes(voters[i].email)),
                "Admin with this email already exists"
            );
        }

        // Increment the voterCount to use as the new admin's ID
        voterCount += 1;

        // Hash the password
        bytes32 hashedPassword = keccak256(abi.encodePacked(_password));

        // Create and store the new admin
        Voter storage newAdmin = voters[voterCount];
        newAdmin.id = voterCount;
        newAdmin.email = _email;
        newAdmin.password = hashedPassword;
        newAdmin.role = _role;
        newAdmin.status = 1; 

    // Emit the event for adding a new voter/admin
    emit VoterAdded(voterCount, _email);
    }

    function getAllAdmin() public view returns (Voter[] memory) {
        // Create an array to store all admins
        Voter[] memory adminFound = new Voter[](voterCount);
        uint256 count = 0;

        // Iterate through all voters
        for (uint256 i = 1; i <= voterCount; i++) {
            // Check if the voter has the role "A" (Admin) or "S" (SuperAdmin)
            if (
                keccak256(bytes(voters[i].role)) == keccak256(bytes("A")) ||
                keccak256(bytes(voters[i].role)) == keccak256(bytes("S"))
            ) {
                // Add the admin to the array
                adminFound[count] = voters[i];
                count += 1;
            }
        }

        return adminFound;
    }

    function getAdminById(uint256 _id) public view returns (Voter memory) {
        return voters[_id];
    }

    function editAdminEmailPassword(
        uint256 _adminId, 
        string memory _newEmail, 
        string memory _newPassword
    ) public {
        // Check if the admin exists
        require(_adminId > 0 && _adminId <= voterCount, "Admin does not exist.");
        
        // Check for email uniqueness if the email is being changed
        if(keccak256(bytes(_newEmail)) != keccak256(bytes(voters[_adminId].email))) {
            for (uint256 i = 1; i <= voterCount; i++) {
                require(
                    keccak256(bytes(_newEmail)) != keccak256(bytes(voters[i].email)),
                    "Email already in use."
                );
            }
        }

        voters[_adminId].email = _newEmail;
        
        if(bytes(_newPassword).length > 0) {
            voters[_adminId].password = keccak256(abi.encodePacked(_newPassword));
        }
    }

    function editUserStatus(uint256 _adminId, uint256 _newStatus) public {
        require(_adminId > 0 && _adminId <= voterCount, "Admin or Voter does not exist.");

        require(_newStatus <= 2, "Invalid status.");

        voters[_adminId].status = _newStatus;
    }

    function getAllVoter() public view returns (Voter[] memory) {
        Voter[] memory voterFound = new Voter[](voterCount);
        uint256 count = 0;

        // Iterate through all voters
        for (uint256 i = 1; i <= voterCount; i++) {
            // Check if the voter has the role "U" (Voter) 
            if (
                keccak256(bytes(voters[i].role)) == keccak256(bytes("U"))
            ) {
                voterFound[count] = voters[i];
                count += 1;
            }
        }

        return voterFound;
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

    function getVoterEmailById(uint256 _voterId)
        public
        view
        returns (string memory)
    {
        require(_voterId > 0 && _voterId <= voterCount, "Invalid voter ID");
        return voters[_voterId].email;
    }

    function checkUserExistByEmail(string memory _email) public view returns (bool) {
        for (uint256 i = 1; i <= voterCount; i++) {
            if (keccak256(abi.encodePacked(_email)) == keccak256(abi.encodePacked(voters[i].email))) {
                return true;
            }
        }
        return false;
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

    /* function addCategory(string memory _categoryName) public {
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

    function updateCategory(uint256 _categoryId, string memory _newCategoryName) public {
        // Check if the category exists
        require(categories[_categoryId].categoryId != 0, "Category does not exist");

        // Check if the new category name is different from the existing names
        for (uint256 i = 1; i <= categoryCount; i++) {
            if (i != _categoryId) {
                require(
                    keccak256(bytes(_newCategoryName)) !=
                    keccak256(bytes(categories[i].categoryName)),
                    "Category name already exists"
                );
            }
        }

        // Update the category name
        categories[_categoryId].categoryName = _newCategoryName;
    }

    // function deleteCategory(uint256 _categoryId) public {
    //     require(
    //         categories[_categoryId].categoryId != 0,
    //         "Category does not exist"
    //     );

    //     // Check if there are any events associated with the category
    //     require(
    //         categories[_categoryId].events.length == 0,
    //         "Cannot delete category with events"
    //     );

    //     // Check if there are any candidates associated with the category
    //     for (uint256 i = 1; i <= eventCount; i++) {
    //         Event storage currentEvent = events[i];
    //         if (
    //             currentEvent.categoryId == _categoryId &&
    //             currentEvent.candidates.length > 0
    //         ) {
    //             revert("Cannot delete category with candidates");
    //         }
    //     }

    //     // Check if there are any vote events associated with the category
    //     for (uint256 i = 1; i <= voteEventCount; i++) {
    //         if (voteEvents[i].categoryId == _categoryId) {
    //             revert("Cannot delete category with vote events");
    //         }
    //     }

    //     // If no associated events, candidates, or vote events, delete the category
    //     delete categories[_categoryId];
    // }

    function getAllVotedHistory(string memory _userKey) public view returns (voteEventStruct[] memory) {
        // Check if there are any candidates associated with the category
        voteEventStruct[] memory voteEventFound = new voteEventStruct[](
            voteEventCount
        );
        uint256 count = 0;
        for (uint256 i = 1; i <= voteEventCount; i++) {
            if ( keccak256(bytes(voteEvents[i].voterKey)) ==  keccak256(bytes(_userKey))) {
                // Store the matching vote event in the array
                voteEventFound[count] = voteEvents[i];
                count += 1;
            }
        }

        // Resize the array to remove any unused slots
        assembly {
            mstore(voteEventFound, count)
        }

        // Return the dynamic array of matching vote events
        return voteEventFound;
    }

    /* function addEvent(
        uint256 _categoryId,
        string memory _eventName,
        uint256 _startDateTime,
        uint256 _endDateTime
    ) public {
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
        newEvent.startDateTime = _startDateTime;
        newEvent.endDateTime = _endDateTime;
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

    function isEventStart(
        uint256 _categoryId,
        string memory _eventName,
        uint256 _startDateTime
    ) public view returns (bool) {
        // Check if the category exists
        require(
            categories[_categoryId].categoryId != 0,
            "Category does not exist"
        );

        require(
            isEventExists(_categoryId, _eventName) == true,
            "Event does not exist"
        );

        // Loop through the events in the specified category
        for (uint256 i = 0; i < categories[_categoryId].events.length; i++) {
            if (
                (keccak256(
                    bytes(categories[_categoryId].events[i].eventName)
                ) ==
                    keccak256(bytes(_eventName)) &&
                    (_startDateTime >=
                        categories[_categoryId].events[i].startDateTime))
            ) {
                
                return true;
            }
        }

        // Event not found in the specified category
        return false;
    }

    function updateEvent(
        uint256 _categoryId,
        uint256 _eventId,
        string memory _newEventName,
        uint256 _newStartDateTime,
        uint256 _newEndDateTime
    ) public {
        // Check if the category exists
        require(categories[_categoryId].categoryId != 0, "Category does not exist");

        // Find the event
        bool eventExists = false;
        uint256 eventIndex;
        for (uint256 i = 0; i < categories[_categoryId].events.length; i++) {
            if (categories[_categoryId].events[i].eventId == _eventId) {
                eventExists = true;
                eventIndex = i;
                break;
            }
        }
        require(eventExists, "Event does not exist");

        // Check if the new event name is not the same as other events in the category
        for (uint256 i = 0; i < categories[_categoryId].events.length; i++) {
            if (
                i != eventIndex &&
                keccak256(bytes(categories[_categoryId].events[i].eventName)) ==
                keccak256(bytes(_newEventName))
            ) {
                revert("Event name already exists");
            }
        }

        // Check if the event is not in progress (start date time is in the future)
        require(
            !isEventStart(_categoryId, categories[_categoryId].events[eventIndex].eventName, block.timestamp),
            "Cannot edit event when voting has started"
        );

        // Update the event details
        categories[_categoryId].events[eventIndex].eventName = _newEventName;
        categories[_categoryId].events[eventIndex].startDateTime = _newStartDateTime;
        categories[_categoryId].events[eventIndex].endDateTime = _newEndDateTime;
    }

    function deleteEvent(uint256 _categoryId, uint256 _eventId) public {
        // Check if the category exists
        require(categories[_categoryId].categoryId != 0, "Category does not exist");

        // Find the event
        bool eventExists = false;
        uint256 eventIndex;
        string memory eventName;
        for (uint256 i = 0; i < categories[_categoryId].events.length; i++) {
            if (categories[_categoryId].events[i].eventId == _eventId) {
                eventExists = true;
                eventIndex = i;
                eventName = categories[_categoryId].events[i].eventName;
                break;
            }
        }
        require(eventExists, "Event does not exist");

        // Check if voting has not started using isEventStart
        require(
            !isEventStart(_categoryId, eventName, block.timestamp),
            "Cannot delete event when voting has started"
        );

        // Check if there are any candidates associated with the event
        require(categories[_categoryId].events[eventIndex].candidates.length == 0, "Cannot delete event with candidates");

        // Delete the event from the category's event list
        for (uint256 i = eventIndex; i < categories[_categoryId].events.length - 1; i++) {
            categories[_categoryId].events[i] = categories[_categoryId].events[i + 1];
        }
        categories[_categoryId].events.pop();
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
        require(isEventExistsById(_categoryId, _eventId), "Event does not exist");
        require(
            !isCandidateExistsInEvent(_categoryId, _eventId, _studentId),
            "Candidate already exists"
        );

        // Check if voting has started for the specified event
        require(
            !isEventStart(_categoryId, categories[_categoryId].events[_eventId - 1].eventName, block.timestamp),
            "Voting has already started, cannot add new candidates"
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

    function updateCandidate(
        uint256 _id,
        string memory _name,
        string memory _description,
        uint256 _studentId,
        uint256 _categoryId,
        uint256 _eventId,
        string memory _imageFileName
    ) public {
        bool eventExists = false;
        uint256 eventIndex;
        string memory eventName;
        for (uint256 i = 0; i < categories[_categoryId].events.length; i++) {
            if (categories[_categoryId].events[i].eventId == _eventId) {
                eventExists = true;
                eventIndex = i;
                eventName = categories[_categoryId].events[i].eventName;
                break;
            }
        }

        // require(eventExists, "Event does not exist");

        // Check if voting has not started using isEventStart
        require(
            !isEventStart(_categoryId, eventName, block.timestamp),
            "Cannot edit event when voting has started"
        );

        bool candidateExists = false;
        uint256 candidateIndex;
        for (uint256 i = 0; i < categories[_categoryId].events[eventIndex].candidates.length; i++) {
            if (categories[_categoryId].events[eventIndex].candidates[i].id == _id) {
                candidateExists = true;
                candidateIndex = i;
                break;
            }
        }
        
        // require(candidateExists, "Candidate does not exist");

        for (uint256 j = 0; j < categories[_categoryId].events[eventIndex].candidates.length; j++) {
            if (j != candidateIndex) {
                require(
                    _studentId != categories[_categoryId].events[eventIndex].candidates[j].studentId,
                    "This student ID already exists"
                );
            }
        }

        // Update candidate details
        Candidate storage candidateToUpdate = categories[_categoryId].events[eventIndex].candidates[candidateIndex];

        candidateToUpdate.name = _name;
        candidateToUpdate.description = _description;
        candidateToUpdate.studentId = _studentId;

        // Update image file name only if a new image file name is provided
        if (bytes(_imageFileName).length > 0) {
            // Mark the old image file name as not used
            usedImageFileNames[candidateToUpdate.imageFileName] = false;

            // Update the image file name
            candidateToUpdate.imageFileName = _imageFileName;

            // Mark the new image file name as used
            usedImageFileNames[_imageFileName] = true;
        }
    }


    function deleteCandidate(uint256 _categoryId, uint256 _eventId, uint256 _candidateId) public {
        require(categories[_categoryId].categoryId != 0, "Category does not exist");

        // Find the event
        bool eventExists = false;
        uint256 eventIndex;
        for (uint256 i = 0; i < categories[_categoryId].events.length; i++) {
            if (categories[_categoryId].events[i].eventId == _eventId) {
                eventExists = true;
                eventIndex = i;
                break;
            }
        }
        require(eventExists, "Event does not exist");

        Event storage eventToDeleteFrom = categories[_categoryId].events[eventIndex];

        require(
            !isEventStart(_categoryId, eventToDeleteFrom.eventName, block.timestamp),
            "Cannot delete candidate after voting has started"
        );

        bool candidateFound = false;
        uint256 candidateIndex;
        for (uint256 i = 0; i < eventToDeleteFrom.candidates.length; i++) {
            if (eventToDeleteFrom.candidates[i].id == _candidateId) {
                candidateIndex = i;
                candidateFound = true;
                break;
            }
        }
        require(candidateFound, "Candidate does not exist");

        // Mark the image file name as not used
        usedImageFileNames[eventToDeleteFrom.candidates[candidateIndex].imageFileName] = false;

        // If the candidate was found, remove the candidate from the list
        for (uint256 i = candidateIndex; i < eventToDeleteFrom.candidates.length - 1; i++) {
            eventToDeleteFrom.candidates[i] = eventToDeleteFrom.candidates[i + 1];
        }
        eventToDeleteFrom.candidates.pop();
    }

    function isImageFileNameUsed(string memory _imageFileName)
        public
        view
        returns (bool)
    {
        return usedImageFileNames[_imageFileName];
    } */

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

    function isEventExistsById(uint256 _categoryId, uint256 _eventId)
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
        // Check if the category exists
        require(categories[_categoryId].categoryId != 0, "Category does not exist");

        // Find the event
        bool eventExists = false;
        uint256 eventIndex;
        for (uint256 i = 0; i < categories[_categoryId].events.length; i++) {
            if (categories[_categoryId].events[i].eventId == _eventId) {
                eventExists = true;
                eventIndex = i;
                break;
            }
        }
        require(eventExists, "Event does not exist");

        // Return the event details
        return categories[_categoryId].events[eventIndex];
    }

     function getCandidateById(uint256 _categoryId, uint256 _eventId, uint256 _candidateId)
        public
        view
        returns (Candidate memory)
    {
        // Check if the category exists
        require(categories[_categoryId].categoryId != 0, "Category does not exist");

        // Find the event
        bool eventExists = false;
        uint256 eventIndex;
        for (uint256 i = 0; i < categories[_categoryId].events.length; i++) {
            if (categories[_categoryId].events[i].eventId == _eventId) {
                eventExists = true;
                eventIndex = i;
                break;
            }
        }
        require(eventExists, "Event does not exist");

        // Find the candidate in the specified event
        bool candidateExists = false;
        uint256 candidateIndex;
        for (uint256 i = 0; i < categories[_categoryId].events[eventIndex].candidates.length; i++) {
            if (categories[_categoryId].events[eventIndex].candidates[i].id == _candidateId) {
                candidateExists = true;
                candidateIndex = i;
                break;
            }
        }
        require(candidateExists, "Candidate does not exist");

        // Return the candidate details
        return categories[_categoryId].events[eventIndex].candidates[candidateIndex];
    }

    function getEventsByDateRange(uint256 _startDateTime, uint256 _endDateTime)
        public
        view
        returns (Event[] memory)
    {
        // Declare a dynamic array to store events within the date range
        Event[] memory eventsInRange;

        // Counter to keep track of the number of events within the date range
        uint256 count = 0;

        // Loop through all categories and events
        for (uint256 i = 1; i <= categoryCount; i++) {
            for (uint256 j = 0; j < categories[i].events.length; j++) {
                Event storage currentEvent = categories[i].events[j];

                // Check if the event's start date is on or after the specified start date
                // and the event's end date is on or before the specified end date
                if (
                    currentEvent.startDateTime >= _startDateTime &&
                    currentEvent.endDateTime <= _endDateTime
                ) {
                    // Resize the array and add the event
                    eventsInRange = resizeAndAddEvent(eventsInRange, currentEvent, count);
                    count++;
                }
            }
        }

        return eventsInRange;
    }

    // Helper function to resize the array and add an event
    function resizeAndAddEvent(
        Event[] memory array,
        Event memory newEvent,
        uint256 count
    ) internal pure returns (Event[] memory) {
        Event[] memory newArray = new Event[](count + 1);

        for (uint256 i = 0; i < count; i++) {
            newArray[i] = array[i];
        }

        newArray[count] = newEvent;

        return newArray;
    }

    /* function vote(
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
                keccak256(bytes(_voterKey)) ==
                keccak256(bytes(voteEvents[i].voterKey)) &&
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
            votedCandidateId : _candidateId,
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
    } */
}
