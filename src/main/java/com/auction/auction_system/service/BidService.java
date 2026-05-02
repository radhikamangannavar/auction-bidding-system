package com.auction.auction_system.service;

import com.auction.auction_system.entity.*;
import com.auction.auction_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private UserRepository userRepository;

    public String placeBid(int userId, int auctionId, double amount) {

        User user = userRepository.findById(userId).orElse(null);
        Auction auction = auctionRepository.findById(auctionId).orElse(null);

        if (user == null || auction == null) {
            return "Invalid user or auction";
        }

        // 🔥 AUTO-CLOSE LOGIC
        if (LocalDateTime.now().isAfter(auction.getEndTime())) {
            auction.setStatus("CLOSED");
            auctionRepository.save(auction);
            return "Auction has ended";
        }

        if ("CLOSED".equals(auction.getStatus())) {
            return "Auction is closed";
        }

        if (amount <= auction.getCurrentPrice()) {
            return "Bid must be higher than current price";
        }

        Bid bid = new Bid();
        bid.setAmount(amount);
        bid.setTimestamp(LocalDateTime.now());
        bid.setUser(user);
        bid.setAuction(auction);

        auction.setCurrentPrice(amount);

        bidRepository.save(bid);
        auctionRepository.save(auction);

        return "Bid placed successfully";
    }
    public List<Bid> getBidsForAuction(int auctionId) {
        Auction auction = auctionRepository.findById(auctionId).orElse(null);

        if (auction == null) {
            return List.of();
        }

        return bidRepository.findByAuction(auction);
    }
}