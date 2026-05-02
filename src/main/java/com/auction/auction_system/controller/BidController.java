package com.auction.auction_system.controller;

import com.auction.auction_system.entity.Bid;
import com.auction.auction_system.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @PostMapping("/place")
    public String placeBid(
            @RequestParam int userId,
            @RequestParam int auctionId,
            @RequestParam double amount) {

        return bidService.placeBid(userId, auctionId, amount);
    }

    @GetMapping("/{auctionId}")
    public List<Bid> getBids(@PathVariable int auctionId) {
        return bidService.getBidsForAuction(auctionId);
    }
}