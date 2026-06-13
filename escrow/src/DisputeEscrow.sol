// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DisputeEscrow {
    struct Escrow {
        address client;
        address freelancer;
        uint256 amount;
        bool resolved;
    }

    mapping(uint256 => Escrow) public escrows;
    uint256 public nextId;
    address public resolver;

    constructor(address _resolver) {
        resolver = _resolver;
    }

    function deposit(address freelancer) external payable returns (uint256) {
        uint256 id = nextId++;
        escrows[id] = Escrow(msg.sender, freelancer, msg.value, false);
        return id;
    }

    function resolve(uint256 id, uint256 clientPct) external {
        require(msg.sender == resolver, "only resolver");
        Escrow storage e = escrows[id];
        require(!e.resolved, "already resolved");
        e.resolved = true;

        uint256 clientAmt = (e.amount * clientPct) / 100;
        uint256 freelancerAmt = e.amount - clientAmt;

        if (clientAmt > 0) payable(e.client).transfer(clientAmt);
        if (freelancerAmt > 0) payable(e.freelancer).transfer(freelancerAmt);
    }
}
