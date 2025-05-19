package com.ltlt.services.impl;

import com.ltlt.pojo.Locker;
import com.ltlt.repositories.LockerRepository;
import com.ltlt.services.LockerService;
import com.ltlt.services.NotificationService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LockerServiceImpl implements LockerService {

    @Autowired
    private LockerRepository lockerRepo;
    
    @Autowired
    private NotificationService notificationService;

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
        // Send notification when item is added
        notificationService.sendLockerNotification(item.getUserId().getId(), item.getItemName());
    }

    @Override
    public boolean changeLockerStatus(int lockerId, String status) {
        return lockerRepo.updateStatus(lockerId, status);
    }
}
