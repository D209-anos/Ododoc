package com.ssafy.ododoc.directory.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDirectory is a Querydsl query type for Directory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDirectory extends EntityPathBase<Directory> {

    private static final long serialVersionUID = -1870748340L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDirectory directory = new QDirectory("directory");

    public final com.ssafy.ododoc.common.util.QBaseTime _super = new com.ssafy.ododoc.common.util.QBaseTime(this);

    public final ListPath<Directory, QDirectory> children = this.<Directory, QDirectory>createList("children", Directory.class, QDirectory.class, PathInits.DIRECT2);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdTime = _super.createdTime;

    public final DateTimePath<java.time.LocalDateTime> deletedTime = createDateTime("deletedTime", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final com.ssafy.ododoc.member.entity.QMember member;

    public final StringPath name = createString("name");

    public final QDirectory parent;

    public final DateTimePath<java.time.LocalDateTime> trashbinTime = createDateTime("trashbinTime", java.time.LocalDateTime.class);

    public final EnumPath<com.ssafy.ododoc.directory.type.DirectoryType> type = createEnum("type", com.ssafy.ododoc.directory.type.DirectoryType.class);

    public QDirectory(String variable) {
        this(Directory.class, forVariable(variable), INITS);
    }

    public QDirectory(Path<? extends Directory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDirectory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDirectory(PathMetadata metadata, PathInits inits) {
        this(Directory.class, metadata, inits);
    }

    public QDirectory(Class<? extends Directory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new com.ssafy.ododoc.member.entity.QMember(forProperty("member")) : null;
        this.parent = inits.isInitialized("parent") ? new QDirectory(forProperty("parent"), inits.get("parent")) : null;
    }

}

