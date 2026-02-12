package com.project.Bom.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.project.Bom.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ProductNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleProductNotFound(
	        ProductNotFoundException ex) {

	    return ResponseEntity.status(HttpStatus.NOT_FOUND)
	            .body(new ErrorResponse(
	                    404,
	                    "Not Found",
	                    "PRODUCT_NOT_FOUND",
	                    ex.getMessage()
	            ));
	}

    @ExceptionHandler(ComponentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleComponentNotFound(ComponentNotFoundException ex) {
    	return ResponseEntity.status(HttpStatus.NOT_FOUND)
	            .body(new ErrorResponse(
	                    404,
	                    "Not Found",
	                    "COMPONENT_NOT_FOUND",
	                    ex.getMessage()
	            ));
    }

    @ExceptionHandler(InvalidProductException.class)
    public ResponseEntity<String> handleInvalidProduct(InvalidProductException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidComponentException.class)
    public ResponseEntity<ErrorResponse> handleInvalidComponent(
            InvalidComponentException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(
                        400,
                        "Bad Request",
                        "INVALID_COMPONENT",
                        ex.getMessage()
                ));
    }

    @ExceptionHandler(InvalidHierarchyException.class)
    public ResponseEntity<ErrorResponse> handleInvalidHierarchy(
            InvalidHierarchyException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(
                        400,
                        "Bad Request",
                        "INVALID_HIERARCHY",
                        ex.getMessage()
                ));
    }

    @ExceptionHandler(PlanLimitException.class)
    public ResponseEntity<ErrorResponse> handlePlanLimit(
            PlanLimitException ex) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse(
                        403,
                        "Forbidden",
                        "PLAN_LIMIT_REACHED",
                        ex.getMessage()
                ));
    }

    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException ex) {

        ErrorResponse error = new ErrorResponse(
                401,
                "Unauthorized",
                "INVALID_CREDENTIALS",
                "Username or password is incorrect"
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
    
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(
            UsernameNotFoundException ex) {

        ErrorResponse error = new ErrorResponse(
                401,
                "Unauthorized",
                "USER_NOT_FOUND",
                "User does not exist"
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(
            DuplicateResourceException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(
                        400,
                        "Bad Request",
                        "USERNAME_EXISTS",
                        ex.getMessage()
                ));
    }

    @ExceptionHandler(DuplicateProductException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateProduct(
            DuplicateProductException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(
                        400,
                        "Bad Request",
                        "PRODUCT_CODE_ALREADY_EXISTS",
                        ex.getMessage()
                ));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse(
                        403,
                        "Forbidden",
                        "ACCESS_DENIED",
                        ex.getMessage()
                ));
    }



}
