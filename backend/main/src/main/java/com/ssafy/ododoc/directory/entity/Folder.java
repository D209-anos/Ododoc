package com.ssafy.ododoc.directory.entity;

import com.ssafy.ododoc.common.util.BaseTime;
import com.ssafy.ododoc.member.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Folder extends BaseTime {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "varchar(200) default '새 폴더'")
    private String name;

    private LocalDateTime trashbinTime;

    private LocalDateTime deletedTime;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Folder parent;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    private List<Folder> children = new ArrayList<>();
}
