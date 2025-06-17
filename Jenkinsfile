pipeline {
    agent {
        label 'docker-agent-test'
    }

    environment {
        IMAGE_NAME = "manga_image"
        CONTAINER_NAME = "manga_container"
        IMAGE_TAG = "${BUILD_NUMBER}"
        PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'git@github.com:hoang19020302/nuxt3_project.git',
                    branch: 'main',
                    credentialsId: 'git-ssh'
            }
        }

        stage('Test User') {
           steps {
               sh 'whoami'
               sh 'id'
               sh 'groups'
           }
        }

        stage('Build Docker Image') {
            steps {
                 sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
                 sh 'docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest'
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                script {
                    sh 'docker rm -f $CONTAINER_NAME || true'
                }
            }
        }

        stage('Run Container') {
            steps {
                withCredentials([file(credentialsId: 'MANGA_FE_ENV_PROD', variable: 'ENV_PROD_CONTENT')]) {
                    sh '''
                        mkdir -p ./tmp_env
                        cp "$ENV_PROD_CONTENT" ./tmp_env/env_config.js
                        chmod 644 ./tmp_env/env_config.js

                        docker run -d --name $CONTAINER_NAME -p $PORT:3000 $IMAGE_NAME:$IMAGE_TAG
                        
                        echo "[DEBUG] Copy env_config.js vào container..."
                        docker cp ./tmp_env/env_config.js $CONTAINER_NAME:/tmp/env_config.js 
                       
                        docker ps -a
                    '''
                }
            }
        }

        stage('Cleanup Dangling Images') {
            steps {
                sh 'docker image prune -f'
            }
        }

        stage('Test') {
            steps {
                echo 'Hello from Jenkins agent!!'
                sh 'whoami'
                sh 'uname -a'
            }
        }
    }

    post {
        success {
            slackSend (
                channel: '#ci-notifications',
                message: "✅ Build *${env.JOB_NAME}* #${env.BUILD_NUMBER} succeeded!",
                color: 'good'
            )
        }
        failure {
            slackSend (
                channel: '#ci-notifications',
                message: "❌ Build *${env.JOB_NAME}* #${env.BUILD_NUMBER} failed!",
                color: 'danger'
            )
        }
    }
}
