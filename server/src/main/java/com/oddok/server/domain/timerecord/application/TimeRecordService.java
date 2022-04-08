package com.oddok.server.domain.timerecord.application;

import com.oddok.server.common.errors.UserNotFoundException;
import com.oddok.server.domain.timerecord.dao.TimeRecordRepository;
import com.oddok.server.domain.timerecord.dto.TimeRecordDto;
import com.oddok.server.domain.timerecord.entity.TimeRecord;
import com.oddok.server.domain.timerecord.mapper.TimeRecordMapper;
import com.oddok.server.domain.user.dao.UserRepository;
import com.oddok.server.domain.user.entity.User;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;

@Service
public class TimeRecordService {

    private final TimeRecordRepository timeRecordRepository;
    private final UserRepository userRepository;

    private final TimeRecordMapper timeRecordMapper;

    public TimeRecordService(TimeRecordRepository timeRecordRepository, UserRepository userRepository) {
        this.timeRecordRepository = timeRecordRepository;
        this.userRepository = userRepository;

        this.timeRecordMapper = Mappers.getMapper(TimeRecordMapper.class);
    }

    public void createTimeRecord(TimeRecordDto timeRecordDto) {
        User user = findUser(timeRecordDto.getUserId());
        TimeRecord timeRecord = timeRecordRepository.save(timeRecordMapper.toEntity(timeRecordDto, user));
        timeRecordMapper.toDto(timeRecord);
    }

    public User findUser(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
    }
}
