package com.wk.cms.service.impl;

import java.util.Date;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.wk.cms.dao.IFileDao;
import com.wk.cms.model.File;
import com.wk.cms.service.IFileService;
import com.wk.cms.service.exception.ServiceException;

@Service
@Lazy
public class FileService implements IFileService {

	@Autowired
	private IFileDao fileDao;
	@Override
	public File findById(String id) {
		return fileDao.findById(id);
	}
	@Override
	public void save(File f) throws ServiceException {
		
		if(!StringUtils.hasLength(f.getId())){
			f.setCrTime(new Date());
			f.setCrUser(null);
			
			fileDao.save(f);
		}else{
			
			File persistFile = findById(f.getId());
			if(persistFile==null){
				throw new ServiceException("未找到ID为【"+f.getId()+"】的文件对象！！");
			}
			BeanUtils.copyProperties(f, persistFile, new String[]{"id","crTime","crUser"});
			fileDao.save(persistFile);
		}
	}
	@Override
	public File copy(File file) throws ServiceException {
		
		File newFile = new File();
		BeanUtils.copyProperties(file, newFile, new String[]{"id","crTime","crUser"});
		save(newFile);
		return newFile;
	}

}
