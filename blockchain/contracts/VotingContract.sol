// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract VotingContract {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool hasVoted;
        uint256 votedCandidateId;
    }

    address public owner;
    mapping(uint256 => Candidate) public candidates;
    mapping(address => Voter) public voters;
    mapping(address => bool) public allowedVoters;
    uint256 public candidatesCount;
    bool public votingEnded;

    event CandidateAdded(uint256 indexed id, string name);
    event Voted(address indexed voter, uint256 indexed candidateId);
    event VoterAllowed(address indexed voter);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier votingActive() {
        require(!votingEnded, "Voting has ended");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function allowVoter(address _voter) public onlyOwner {
        allowedVoters[_voter] = true;
        emit VoterAllowed(_voter);
    }

    function vote(uint256 _candidateId) public votingActive {
        require(allowedVoters[msg.sender], "You are not allowed to vote");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    function endVoting() public onlyOwner {
        votingEnded = true;
    }

    function resetVoting() public onlyOwner {
        // Reset voting state
        votingEnded = false;
        candidatesCount = 0;
        
        // Xóa tất cả candidates (mapping không thể xóa trực tiếp, nên reset trên frontend)
        // Xóa tất cả voters
        // Xóa tất cả allowedVoters
        // Note: Solidity mapping không thể iterate để xóa, frontend sẽ refresh dữ liệu
    }

    function getCandidate(uint256 _id) public view returns (uint256, string memory, uint256) {
        Candidate memory c = candidates[_id];
        return (c.id, c.name, c.voteCount);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidatesCount);
        for (uint256 i = 1; i <= candidatesCount; i++) {
            allCandidates[i - 1] = candidates[i];
        }
        return allCandidates;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
