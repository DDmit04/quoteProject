package com.qute.data;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Data
@Table(name = "usr")
@EqualsAndHashCode(of = {"id"})
public class User implements Serializable {

	@Id
	private String id;
	private String name;
	private String email;

}