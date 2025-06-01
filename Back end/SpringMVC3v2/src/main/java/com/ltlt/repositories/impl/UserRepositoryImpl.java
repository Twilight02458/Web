/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.repositories.impl;

import com.ltlt.pojo.User;
import com.ltlt.repositories.UserRepository;
import jakarta.persistence.NoResultException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.hibernate.query.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author admin
 */
@Repository
@Transactional
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private LocalSessionFactoryBean factory;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private static final Logger LOGGER = Logger.getLogger(UserRepositoryImpl.class.getName());

    @Override
    public User getUserByUsername(String username) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("User.findByUsername", User.class);
        q.setParameter("username", username);

        try {
            return (User) q.getSingleResult();
        } catch (NoResultException ex) {
            LOGGER.log(Level.WARNING, "No user found with username: {0}", username);
            return null;
        }
    }

    @Override
    public User getUserById(int userId) {
        Session s = this.factory.getObject().getCurrentSession();
        try {
            return s.get(User.class, userId);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error fetching user with ID: {0}", userId);
            return null;
        }
    }

    @Override
    public User addUser(User u) {
        Session s = this.factory.getObject().getCurrentSession();
        try {
            s.persist(u);
            return u;
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error adding user: {0}", ex.getMessage());
            throw ex;
        }
    }

    @Override
    public boolean authenticate(String username, String password) {
        User u = this.getUserByUsername(username);
        if (u == null) {
            return false;
        }
        return this.passwordEncoder.matches(password, u.getPassword());
    }

   @Override
public void updateUser(User user) {
    Session session = this.factory.getObject().getCurrentSession();
    try {
        User existingUser = session.get(User.class, user.getId());
        if (existingUser != null) {
            // Chỉ cập nhật các trường không null (tùy use case của bạn)
            if (user.getFirstName() != null)
                existingUser.setFirstName(user.getFirstName());
            if (user.getLastName() != null)
                existingUser.setLastName(user.getLastName());
            if (user.getEmail() != null)
                existingUser.setEmail(user.getEmail());
            if (user.getPhone() != null)
                existingUser.setPhone(user.getPhone());
            if (user.getUsername() != null)
                existingUser.setUsername(user.getUsername());
            if (user.getPassword() != null)
                existingUser.setPassword(user.getPassword());
            if (user.getAvatar() != null)
                existingUser.setAvatar(user.getAvatar());
            if (user.getRole() != null)
                existingUser.setRole(user.getRole());

            // Trường boolean thì kiểm tra với true/false
            existingUser.setPasswordChanged(user.getPasswordChanged());
            existingUser.setAvatarUploaded(user.getAvatarUploaded());
            if (user.getActive()!= null)
                existingUser.setActive(user.getActive());

            session.update(existingUser);
        } else {
            throw new IllegalArgumentException("User with ID " + user.getId() + " not found");
        }
    } catch (Exception ex) {
        LOGGER.log(Level.SEVERE, "Error updating user: {0}", ex.getMessage());
        throw ex;
    }
}

    @Override
    public boolean deleteUser(int userId) {
        Session session = this.factory.getObject().getCurrentSession();
        try {
            User user = session.get(User.class, userId);
            if (user != null) {
                session.delete(user);
                return true;
            }
            return false;
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error deleting user", ex);
            return false;
        }
    }

    @Override
    public List<User> getAllUsers() {
        Session session = this.factory.getObject().getCurrentSession();
        Query query = session.createQuery("FROM User", User.class);
        return query.getResultList();
    }

    @Override
    public List<User> getUsers(int page, int size, String keyword) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<User> cq = cb.createQuery(User.class);
        Root<User> root = cq.from(User.class);
        cq.select(root);

        List<Predicate> predicates = new ArrayList<>();

        if (keyword != null && !keyword.isEmpty()) {
            Predicate usernameLike = cb.like(root.get("username"), "%" + keyword + "%");
            Predicate emailLike = cb.like(root.get("email"), "%" + keyword + "%");
            predicates.add(cb.or(usernameLike, emailLike));
        }

        if (!predicates.isEmpty()) {
            cq.where(predicates.toArray(new Predicate[0]));
        }

        Query<User> query = session.createQuery(cq);
        query.setFirstResult(page * size);
        query.setMaxResults(size);

        return query.getResultList();
    }

}
