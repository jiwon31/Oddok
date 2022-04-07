package com.oddok.server.domain.studyroom.entity;

import com.oddok.server.domain.studyroom.dto.StudyRoomDto;
import com.oddok.server.domain.user.entity.User;

import java.util.*;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyRoom {

    @Id
    @GeneratedValue
    Long id;

    @Column(unique = true, nullable = false, length = 255)
    private String name;

    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "session_id")
    private String sessionId;

    private String image;

    @Column(name = "is_publlic")
    private Boolean isPublic;

    @Column(length = 255)
    private String password;

    @Column(name = "target_time")
    private Integer targetTime;

    private String rule;

    @Column(name = "is_mic_on")
    private Boolean isMicOn;

    @Column(name = "is_cam_on")
    private Boolean isCamOn;

    @Column(name = "current_users")
    private Integer currentUsers = 0;

    @Column(name = "limit_users")
    private Integer limitUsers;

    @Column(name = "start_at")
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @CreatedDate
    @Column(name = "create_at")
    private LocalDateTime createAt;

    @OneToMany(mappedBy = "studyRoom",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Set<StudyRoomHashtag> hashtags = new HashSet<>();

    @Builder
    public StudyRoom(String name, String category, User user,
                     String sessionId, String image, Boolean isPublic,
                     String password, Integer targetTime, String rule,
                     Boolean isMicOn, Boolean isCamOn, Integer limitUsers,
                     LocalDateTime startAt, LocalDateTime endAt) {
        this.name = name;
        this.category = category;
        this.user = user;
        this.sessionId = sessionId;
        this.image = image;
        this.isPublic = isPublic;
        this.password = password;
        this.targetTime = targetTime;
        this.rule = rule;
        this.isMicOn = isMicOn;
        this.isCamOn = isCamOn;
        this.limitUsers = limitUsers;
        this.startAt = startAt;
        this.endAt = endAt;
        this.createAt = LocalDateTime.now();
    }

    public StudyRoom update(StudyRoomDto studyRoomDto) {
        this.name = studyRoomDto.getName();
        this.category = studyRoomDto.getCategory();
        this.image = studyRoomDto.getImage();
        this.isPublic = studyRoomDto.getIsPublic();

        if (studyRoomDto.getIsPublic()) {
            this.password = null;
        }

        this.password = studyRoomDto.getPassword();
        this.targetTime = studyRoomDto.getTargetTime();
        this.rule = studyRoomDto.getRule();
        this.isMicOn = studyRoomDto.getIsMicOn();
        this.isCamOn = studyRoomDto.getIsCamOn();
        this.limitUsers = studyRoomDto.getLimitUsers();
        this.startAt = studyRoomDto.getStartAt();
        this.endAt = studyRoomDto.getEndAt();
        updateHashtag(studyRoomDto.getHashtags());
        return this;
    }

    public void addHashtag(Hashtag hashtag) {
        StudyRoomHashtag studyRoomHashtag = StudyRoomHashtag.builder().studyRoom(this).hashtag(hashtag)
                .build();
        this.hashtags.add(studyRoomHashtag);
    }

    private List<StudyRoomHashtag> updateHashtag(Set<String> newHashtags) {
        List<StudyRoomHashtag> toBeDeletedHashtags = new ArrayList<>();
        for (Iterator<StudyRoomHashtag> itr = hashtags.iterator(); itr.hasNext(); ) {
            StudyRoomHashtag studyRoomHashtag = itr.next();
            if (!newHashtags.remove(studyRoomHashtag.getHashtag().getName())) { // 새로운 해시태그 중에 기존에 있던 해시태그가 있으면 삭제
                itr.remove();
                toBeDeletedHashtags.add(studyRoomHashtag);
            }
        }
        for (StudyRoomHashtag studyRoomHashtag : toBeDeletedHashtags) {
            hashtags.remove(studyRoomHashtag);
        }
        return toBeDeletedHashtags;
    }


}
