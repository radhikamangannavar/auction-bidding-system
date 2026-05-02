package com.auction.auction_system.service;

import com.auction.auction_system.entity.Auction;
import com.auction.auction_system.repository.AuctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuctionService {

    @Autowired
    private AuctionRepository auctionRepository;

    public Auction createAuction(Auction auction) {
        auction.setCurrentPrice(auction.getStartingPrice());
        auction.setStatus("OPEN");
        return auctionRepository.save(auction);
    }

    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    public Auction getAuctionById(int id) {
        return auctionRepository.findById(id).orElse(null);
    }

    public void closeAuction(Auction auction) {
        if (LocalDateTime.now().isAfter(auction.getEndTime())) {
            auction.setStatus("CLOSED");
            auctionRepository.save(auction);
        }
    }
}