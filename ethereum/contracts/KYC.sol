// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.9.0;

contract KycFactory{
    struct Register{
        Userdef kycContract;
        bool isRegistered;
        bool kycdone;
    }
    Userdef[] public deployedKycs;
    mapping(Userdef => bool) agentdeployedKycs;
    mapping(address => Register) particularUserKyc;

    function createKyc() public{
        Userdef newKyc = new Userdef(msg.sender);
        particularUserKyc[msg.sender].kycContract = newKyc;
        particularUserKyc[msg.sender].isRegistered = true;
        particularUserKyc[msg.sender].kycdone = false;
        agentdeployedKycs[newKyc] = false;
        deployedKycs.push(newKyc);
    }

    function login(address ooh) public view returns(Userdef){
        require(particularUserKyc[ooh].isRegistered);
        return particularUserKyc[ooh].kycContract;
    }

    function getDeployedKycs() public view returns(Userdef[] memory) {
        return deployedKycs;
    }


    function getRandomUser() public view returns(Userdef) {
        Userdef[] storage falsedeployed;
        for(uint i=0; i<deployedKycs.length; i++){
            if(!agentdeployedKycs[deployedKycs[i]]){
                falsedeployed.push(deployedKycs[i]);
            }
        }
        uint index = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, falsedeployed)))%falsedeployed.length;
        return falsedeployed[index];
    }

    function getparticularUser() public view returns(Userdef){
        return particularUserKyc[msg.sender].kycContract;
    }

}

contract Userdef{

    struct User{
        string name;
        string father;
        string mother;
        string birthdate;
        string add;
        string mob;
        string email;
        string aadhar;
        string pan;
        bool set;
        string aadharipfsHash;
        string panipfsHash;
    }

    address public usersAddress;
    mapping(address => User) users;
    address public manager;             // Approver
    address public assigned;

    modifier userRestricted(){
        require(msg.sender == manager);
        _;
    }

    modifier agentRestricted(){
        require(msg.sender == assigned);
        _;
    }

    constructor(address creator){
        manager = creator;           // User will be owner as it is his/her contract.
    }

    function addUser(string memory n, string memory f, string memory m, string memory d, string memory ad,string memory mo,string memory e,string memory aadhar,string memory pan,string memory ah,string memory ph) 
    public userRestricted{
        address entry = msg.sender;
        require(!users[entry].set);
        usersAddress = entry;
        users[entry].name = n;
        users[entry].father = f;
        users[entry].mother = m;
        users[entry].birthdate = d;
        users[entry].add = ad;
        users[entry].mob = mo;
        users[entry].email = e;
        users[entry].aadhar = aadhar;
        users[entry].pan = pan;
        users[entry].aadharipfsHash = ah;
        users[entry].panipfsHash = ph;
        users[entry].set = true;
    }

    function getDeployedUsers() public view returns(address) {
        return usersAddress;
    }

    //use this joy
    function getparticularUser(address rer) public view
    returns(string memory, string memory, string memory, string memory, string memory, string memory,string memory){
        require(users[rer].set);
        require(rer == manager);
        return (users[rer].name,users[rer].father,users[rer].mother,users[rer].birthdate,users[rer].add,users[rer].mob,users[rer].email);
    }

    function getAadharPan(address rer) public view
    returns(string memory,string memory){
        require(users[rer].set);
        require(rer == manager);
        return (users[rer].aadhar,users[rer].pan);
    }

    function getAadharPanHash(address rer) public view
    returns(string memory,string memory){
        require(users[rer].set);
        return (users[rer].aadharipfsHash,users[rer].panipfsHash);
    }

    function getUserDetails(address ass) public view agentRestricted
    returns(string memory, string memory, string memory, string memory, string memory, string memory,string memory,string memory,string memory){
        require(assigned == ass);
        return (users[manager].name,users[manager].father,users[manager].mother,users[manager].birthdate,users[manager].add,users[manager].mob,users[manager].email,users[manager].aadhar,users[manager].pan);
    }

    struct Request{
        string description;
        string link;
        address recepient;
        bool complete;
    }
    Request requests;

    function createRequest(string memory describe,string memory link) public{
        requests = Request({                    // Agent will create a request for accessing documents of user/manager.
            description: describe,
            link: link,
            recepient: msg.sender,               // Recepient address will be of agent's i.e., assigned
            complete: false
        });
    }

    function approveRequest(address rer) public{
        require(rer == manager);
        require(!requests.complete);
        assigned = requests.recepient;
        requests.complete = true;
    }

} 