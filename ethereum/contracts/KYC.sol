// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.9.0;

contract KycFactory{
    struct Register{
        Userdef kycContract;
        bool isRegistered;
        bool kycdone;
    }
    Userdef[] public deployedKycs;
    mapping(address => Register) particularUserKyc;


    function createKyc() public{
        Userdef newKyc = new Userdef(msg.sender);
        particularUserKyc[msg.sender].kycContract = newKyc;
        particularUserKyc[msg.sender].isRegistered = true;
        particularUserKyc[msg.sender].kycdone = false;
        deployedKycs.push(newKyc);
    }

    function login(address ooh) public view returns(Userdef){
        require(particularUserKyc[ooh].isRegistered);
        return particularUserKyc[ooh].kycContract;
    }

    function getDeployedKycs() public view returns(Userdef[] memory) {
        return deployedKycs;
    }

    function getparticularUser() public view returns(Userdef){
        return particularUserKyc[msg.sender].kycContract;
    }

}

// "a","f","m",454,"asd",9369,"axas",2489,"ad"

contract Userdef{

    struct User{
        string name;
        string father;
        string mother;
        string birthdate;
        string add;
        uint mob;
        string email;
        uint aadhar;
        string pan;
        bool set;
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

    function addUser(string memory n, string memory f, string memory m, string memory d, string memory ad, uint mo,string memory e,uint aadhar,string memory pan) 
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
        users[entry].set = true;
    }


    function getDeployedUsers() public view returns(address) {
        return usersAddress;
    }

    function getparticularUser(address rer) public view
    returns(string memory, string memory, string memory, string memory, string memory, uint,string memory){
        require(users[rer].set);
        require(rer == manager);
        return (users[rer].name,users[rer].father,users[rer].mother,users[rer].birthdate,users[rer].add,users[rer].mob,users[rer].email);
    }

    function getAadharPan(address rer) public view
    returns(uint,string memory){
        require(users[rer].set);
        require(rer == manager);
        return (users[rer].aadhar,users[rer].pan);
    }


    function getUserDetails() public view agentRestricted
    returns(string memory, string memory, string memory, string memory, string memory, uint,string memory,uint,string memory){
        return (users[manager].name,users[manager].father,users[manager].mother,users[manager].birthdate,users[manager].add,users[manager].mob,users[manager].email,users[manager].aadhar,users[manager].pan);
    }

    struct Request{
        string description;
        address recepient;
        bool complete;
    }
    Request requests;

    function createRequest(string memory describe) public{
        requests = Request({                    // Agent will create a request for accessing documents of user/manager.
            description: describe,
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