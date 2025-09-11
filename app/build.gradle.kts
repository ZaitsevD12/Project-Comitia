plugins {
    id("org.springframework.boot") version "3.3.3" // Поддержка Java 21
    id("io.spring.dependency-management") version "1.1.6"
    kotlin("jvm") version "1.9.24" // Для KTS, но код на Java
    kotlin("plugin.spring") version "1.9.24"
}

group = "com.mypeak"
version = "0.0.1-SNAPSHOT"

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    runtimeOnly("org.xerial:sqlite-jdbc:3.46.1.3") // Драйвер SQLite
    implementation("org.projectlombok:lombok:1.18.34") // Для аннотаций
    annotationProcessor("org.projectlombok:lombok:1.18.34")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    implementation("org.hibernate.orm:hibernate-community-dialects:6.5.2.Final")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.bootBuildImage {
    builder.set("paketobuildpacks/builder-jammy-base:latest")
}