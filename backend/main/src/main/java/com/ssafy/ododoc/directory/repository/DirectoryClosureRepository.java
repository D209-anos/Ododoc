package com.ssafy.ododoc.directory.repository;

import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.directory.entity.DirectoryClosure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DirectoryClosureRepository extends JpaRepository<DirectoryClosure, Directory> {

    List<DirectoryClosure> findAllByDescendant(Directory directory);
    List<DirectoryClosure> findAllByAncestor(Directory directory);
}
