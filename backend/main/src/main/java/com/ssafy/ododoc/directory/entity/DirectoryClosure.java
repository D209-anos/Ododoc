package com.ssafy.ododoc.directory.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@DynamicInsert
@IdClass(DirectoryClosureId.class)
public class DirectoryClosure {

    @Id
    @ManyToOne
    @JoinColumn(name = "ancestor_id")
    private Directory ancestor;

    @Id
    @ManyToOne
    @JoinColumn(name = "descendant_id")
    private Directory descendant;

    @Column(columnDefinition = "Integer default 0")
    private Integer depth;
}
