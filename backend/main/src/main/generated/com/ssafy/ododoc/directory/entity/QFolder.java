package com.ssafy.ododoc.directory.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QFolder is a Querydsl query type for Folder
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QFolder extends EntityPathBase<Folder> {

    private static final long serialVersionUID = -1325655569L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QFolder folder = new QFolder("folder");

    public final com.ssafy.ododoc.common.util.QBaseTime _super = new com.ssafy.ododoc.common.util.QBaseTime(this);

    public final ListPath<Folder, QFolder> children = this.<Folder, QFolder>createList("children", Folder.class, QFolder.class, PathInits.DIRECT2);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdTime = _super.createdTime;

    public final DateTimePath<java.time.LocalDateTime> deletedTime = createDateTime("deletedTime", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final com.ssafy.ododoc.member.entity.QMember member;

    public final StringPath name = createString("name");

    public final QFolder parent;

    public final DateTimePath<java.time.LocalDateTime> trashbinTime = createDateTime("trashbinTime", java.time.LocalDateTime.class);

    public QFolder(String variable) {
        this(Folder.class, forVariable(variable), INITS);
    }

    public QFolder(Path<? extends Folder> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QFolder(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QFolder(PathMetadata metadata, PathInits inits) {
        this(Folder.class, metadata, inits);
    }

    public QFolder(Class<? extends Folder> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new com.ssafy.ododoc.member.entity.QMember(forProperty("member")) : null;
        this.parent = inits.isInitialized("parent") ? new QFolder(forProperty("parent"), inits.get("parent")) : null;
    }

}

