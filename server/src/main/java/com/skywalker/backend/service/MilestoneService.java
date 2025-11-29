package com.skywalker.backend.service;

import com.skywalker.backend.dto.MilestoneDTO;
import com.skywalker.backend.model.Milestone;
import com.skywalker.backend.model.User;
import com.skywalker.backend.repository.MilestoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository repository;
    private final UserService userService;

    public List<MilestoneDTO> getAllMilestones() {
        User currentUser = userService.getCurrentUser();
        return repository.findByUser(currentUser).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<MilestoneDTO> getMilestoneById(long id) {
        User currentUser = userService.getCurrentUser();
        return repository.findByIdAndUser(id, currentUser).map(this::toDTO);
    }

    public MilestoneDTO createMilestone(Milestone milestone) {
        Milestone saved = repository.save(milestone);
        return toDTO(saved);
    }

    public void deleteMilestone(long id) {
        User currentUser = userService.getCurrentUser();
        Milestone milestone = repository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Milestone not found"));
        repository.delete(milestone);
    }

    public Optional<MilestoneDTO> updateMilestone(long id, Milestone milestone) {
        User currentUser = userService.getCurrentUser();
        return repository.findByIdAndUser(id, currentUser)
                .map(existing -> {
                    existing.setTitle(milestone.getTitle());
                    existing.setDescription(milestone.getDescription());
                    existing.setAchieveDate(milestone.getAchieveDate());
                    existing.setCompleted(milestone.isCompleted());
                    existing.setCompletedDate(milestone.getCompletedDate());
                    return toDTO(repository.save(existing));
                });
    }

    private MilestoneDTO toDTO(Milestone milestone) {
        MilestoneDTO dto = new MilestoneDTO();
        dto.setId(milestone.getId());
        dto.setTitle(milestone.getTitle());
        dto.setDescription(milestone.getDescription());
        dto.setCompleted(milestone.isCompleted());
        dto.setAchieveDate(milestone.getAchieveDate());
        dto.setCreatedDate(milestone.getCreatedDate());
        dto.setCompletedDate(milestone.getCompletedDate());
        dto.setUserId(milestone.getUser() != null ? milestone.getUser().getId() : null);
        return dto;
    }


}