package com.ssafy.ododoc.directory.repository;

import com.ssafy.ododoc.directory.entity.Directory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DirectoryRepository extends JpaRepository<Directory, Long> {

}
