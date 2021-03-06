package com.wk.cms.mvc.advice;

import java.sql.Blob;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wk.cms.controller.vo.Message;
import com.wk.cms.mvc.editors.MyArrayEditor;
import com.wk.cms.mvc.editors.MyBlobEditor;

@ControllerAdvice
public class CommonAdvice {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(CommonAdvice.class);

	@ExceptionHandler
	public @ResponseBody
	Message handle(Exception e) {

		LOGGER.error(e.getMessage(), e);
		return new Message(false, e.getMessage(), e);
	}

	@InitBinder
	public void initBinder(WebDataBinder dataBinder) {
		dataBinder.registerCustomEditor(Date.class, new CustomDateEditor(
				new SimpleDateFormat("yyyy-MM-dd"), true));
		dataBinder.registerCustomEditor(String[].class, new MyArrayEditor(","));
		dataBinder.registerCustomEditor(Blob.class, new MyBlobEditor("UTF-8"));
	}
}
