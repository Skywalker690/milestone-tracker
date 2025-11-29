package com.skywalker.backend.repository;

import com.skywalker.backend.model.Milestone;
import com.skywalker.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface MilestoneRepository extends JpaRepository<Milestone,Long> {

    List<Milestone> findByUser(User user);

    Optional<Milestone> findByIdAndUser(Long id, User user);
}