---
title: Java8升级为Java17
date: 2025/09/25
tags:
  - Java
  - 版本升级
---

## 1.版本升级

本篇记录了工作中一个项目需求，从 Jdk8 升级到 Jdk17 的项目依赖变化

|             | 修改前 | 修改后 |
| ----------- | ------ | ------ |
| Java        | 8      | 17     |
| Spring Boot | 2.5.15 | 3.3.9  |

## 2.依赖改变

- admin 模块的 pom.xml，修改前

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

- 修改后

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
```

- common 模块的 pom.xml，修改前

```xml
<!-- Jaxb -->
<dependency>
    <groupId>javax.xml.bind</groupId>
    <artifactId>jaxb-api</artifactId>
</dependency>

<!-- servlet包 -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
</dependency>
```

- 修改后

```xml
<!--   javax     -->
<dependency>
  	<groupId>javax.xml.bind</groupId>
  	<artifactId>jaxb-api</artifactId>
  <version>2.3.1</version>
</dependency>


<!-- servlet包 -->
<dependency>
		<groupId>jakarta.servlet</groupId>
		<artifactId>jakarta.servlet-api</artifactId>
</dependency>
<dependency>
		<groupId>jakarta.validation</groupId>
		<artifactId>jakarta.validation-api</artifactId>
		<version>3.0.2</version>
</dependency>
```

- framework 模块的 pom.xml，修改前

```xml
<!-- 阿里数据库连接池 -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
</dependency>

<!-- 验证码 -->
<dependency>
    <groupId>pro.fessional</groupId>
    <artifactId>kaptcha</artifactId>
    <exclusions>
        <exclusion>
            <artifactId>servlet-api</artifactId>
            <groupId>javax.servlet</groupId>
        </exclusion>
    </exclusions>
</dependency>
```

- 修改后

```xml
<!-- 阿里数据库连接池 -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-3-starter</artifactId>
</dependency>

<!-- 验证码 -->
<dependency>
    <groupId>pro.fessional</groupId>
    <artifactId>kaptcha</artifactId>
    <exclusions>
        <exclusion>
            <artifactId>servlet-api</artifactId>
            <groupId>jakarta.servlet</groupId>
        </exclusion>
    </exclusions>
</dependency>
```

## 3.修改代码

### 3.1 替换 javax

1. Java17 不再支持 javax 了，使用 jakarta 替换，在代码中将 javax 批量替换成 jakarta

### 3.2 SecurityConfig

- 修改前

```java
@Bean
protected SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
    return httpSecurity
            // CSRF禁用，因为不使用session
            .csrf(csrf -> csrf.disable())
            // 禁用HTTP响应标头
            .headers((headersCustomizer) -> {
                headersCustomizer.cacheControl(cache -> cache.disable()).frameOptions(options -> options.sameOrigin());
            })
            // 认证失败处理类
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            // 基于token，所以不需要session
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 注解标记允许匿名访问的url
            .authorizeHttpRequests((requests) -> {
                permitAllUrl.getUrls().forEach(url -> requests.antMatchers(url).permitAll());
                // 对于登录login 注册register 验证码captchaImage 允许匿名访问
                requests.antMatchers("/login", "/register", "/captchaImage").permitAll()
                        // 静态资源，可匿名访问
                        .antMatchers(HttpMethod.GET, "/", "/*.html", "/**/*.html", "/**/*.css", "/**/*.js", "/profile/**").permitAll()
                        .antMatchers("/swagger-ui.html", "/swagger-resources/**", "/webjars/**", "/*/api-docs", "/druid/**").permitAll()
                        // 除上面外的所有请求全部需要鉴权认证
                        .anyRequest().authenticated();
            })
            // 添加Logout filter
            .logout(logout -> logout.logoutUrl("/logout").logoutSuccessHandler(logoutSuccessHandler))
            // 添加JWT filter
            .addFilterBefore(authenticationTokenFilter, UsernamePasswordAuthenticationFilter.class)
            // 添加CORS filter
            .addFilterBefore(corsFilter, JwtAuthenticationTokenFilter.class)
            .addFilterBefore(corsFilter, LogoutFilter.class)
            .build();
}
```

- 修改后

```java
@Bean
protected SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
    return httpSecurity
            //CSRF禁用，因为不使用session
            .csrf(AbstractHttpConfigurer::disable)
            // 禁用HTTP响应标头
            .headers(header -> header.cacheControl(HeadersConfigurer.CacheControlConfig::disable).frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
            // 认证失败处理类
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            // 基于token，所以不需要session
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 注解标记允许匿名访问的url
            .authorizeHttpRequests((requests) -> {
                permitAllUrl.getUrls().forEach(url -> requests.requestMatchers(url).permitAll());
                // 对于登录login 注册register 验证码captchaImage 允许匿名访问
                requests.requestMatchers("/login", "/register", "/captchaImage").permitAll()
                        // 静态资源，可匿名访问
                        .requestMatchers(HttpMethod.GET, "/", "/*.html", "/**.html", "/**.css", "/**.js", "/profile/**").permitAll()
                        .requestMatchers("/swagger-ui.html", "/swagger-resources/**", "/webjars/**", "/*/api-docs", "/*/api-docs/**", "/druid/**").permitAll()
                        // 除上面外的所有请求全部需要鉴权认证
                        .anyRequest().authenticated();
            })
            // 添加Logout filter
            .logout(logout -> logout.logoutUrl("/logout").logoutSuccessHandler(logoutSuccessHandler))
            // 添加JWT filter
            .addFilterBefore(authenticationTokenFilter, UsernamePasswordAuthenticationFilter.class)
            // 添加CORS filter
            .addFilterBefore(corsFilter, JwtAuthenticationTokenFilter.class)
            .addFilterBefore(corsFilter, LogoutFilter.class)
            .build();
}
```

### 3.3 DruidConfig

- 修改前

```java
import com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceBuilder;
import com.alibaba.druid.spring.boot.autoconfigure.properties.DruidStatProperties;
```

- 修改后

```java
import com.alibaba.druid.spring.boot3.autoconfigure.DruidDataSourceBuilder;
import com.alibaba.druid.spring.boot3.autoconfigure.properties.DruidStatProperties;
```

### 3.4 @PathVariable

- 换成 SpringBoot 高版本后，@PathVariable 需要指定参数名称，批量替换：@PathVariable\s+(\w+)\s+(\w+) => @PathVariable("$2") $1 $2

- 注意，上述替换只能替换 非数组类型 的字段，数组类型的字段只能手动替换（ sad T_T ）

## 4.更新配置

修改 `application.yml` 文件,将 `spring.redis` 配置更新为 `spring.data.redis`
