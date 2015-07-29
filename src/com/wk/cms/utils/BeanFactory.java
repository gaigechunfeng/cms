package com.wk.cms.utils;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class BeanFactory implements ApplicationContextAware {

	private static ApplicationContext applicationContext;
	@Override
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		BeanFactory.applicationContext = applicationContext;
	}

	public static <T> T getBean(Class<T> clazz){
		
		return applicationContext.getBean(clazz);
	}
}