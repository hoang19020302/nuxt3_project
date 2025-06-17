pipeline {
    agent {
        label 'docker-agent'
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

        stage('Generate env_config.js') {
            steps {
                withCredentials([file(credentialsId: 'MANGA_FE_ENV_PROD', variable: 'ENV_PROD_CONTENT')]) {
                    sh 'cp "$ENV_PROD_CONTENT" env_config.js'
                }
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
                sh 'chmod 644 env_config.js'
                sh 'ls -l env_config.js'
                sh '''
                    echo "File info:"
                    ls -l $(pwd)/env_config.js
                    file $(pwd)/env_config.js
                   '''
                sh 'docker run -v $(pwd)/env_config.js:/tmp/env_config.js -d --name $CONTAINER_NAME -p $PORT:3000 $IMAGE_NAME:$IMAGE_TAG'
                sh 'docker ps -a'
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
