package com.ltlt.services.impl;

import com.ltlt.pojo.Locker;
import com.ltlt.repositories.LockerRepository;
import com.ltlt.services.LockerService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LockerServiceImpl implements LockerService {

    @Autowired
    private LockerRepository lockerRepo;

    @Override
    public List<Locker> getItemsForUser(int userId) {
        return lockerRepo.getItemsByUserId(userId);
    }

    @Override
    public List<Locker> getPendingItems(int userId) {
        return lockerRepo.getPendingItemsByUserId(userId);
    }

    @Override
    public void addNewItem(Locker item) {
        lockerRepo.addLockerItem(item);
    }

    @Override
    public boolean changeLockerStatus(int lockerId, String status) {
        return lockerRepo.updateStatus(lockerId, status);
    }

}
