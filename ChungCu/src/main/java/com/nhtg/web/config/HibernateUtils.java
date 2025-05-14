package com.nhtg.web.config;

import com.nhtg.web.model.Survey;
import com.nhtg.web.model.SurveyQuestion;
import com.nhtg.web.model.SurveyResponse;
import com.nhtg.web.model.User;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;

import java.util.Properties;

public class HibernateUtils {
    private static final SessionFactory FACTORY;

    static {
        Configuration conf = new Configuration();

        Properties props = new Properties();
        props.put("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
        props.put("hibernate.connection.driver_class", "com.mysql.cj.jdbc.Driver");
        props.put("hibernate.connection.url", "jdbc:mysql://localhost:3306/apartment_management?useSSL=false&serverTimezone=UTC");
        props.put("hibernate.connection.username", "root");
        props.put("hibernate.connection.password", "Admin@123456");
        props.put("hibernate.show_sql", "true");
        props.put("hibernate.hbm2ddl.auto", "update");
        conf.setProperties(props);

        // Thêm các entity
        conf.addAnnotatedClass(User.class);
        conf.addAnnotatedClass(Survey.class);
        conf.addAnnotatedClass(SurveyQuestion.class);
        conf.addAnnotatedClass(SurveyResponse.class);

        ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                .applySettings(conf.getProperties()).build();

        FACTORY = conf.buildSessionFactory(serviceRegistry);
    }

    public static SessionFactory getFactory() {
        return FACTORY;
    }
} 