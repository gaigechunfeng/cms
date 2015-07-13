package com.wk.cms.service;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.web.multipart.MultipartFile;

import com.wk.cms.model.Site;
import com.wk.cms.service.exception.ServiceException;

public interface ISiteService {

	List<Site> findAll();

	void save(@NotNull Site site) throws ServiceException;

	Site findByName(String name);

	/**
	 * 
	 * @param siteId 
	 * @return
	 * @throws ServiceException 未找到站点
	 */
	Site findById(String siteId) throws ServiceException;

	void deleteById(String siteId) throws ServiceException;

	void imp(MultipartFile file) throws ServiceException;
}
