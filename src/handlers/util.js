/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */

/**
 * Define all event handlers
 * @author TCSCODER
 * @version 1.0
 */
const _ = require('lodash');
const config = require('config');
const Promise = require('bluebird');
const request = require('request');

/**
 * Makes a GET request to the API server
 * @param {String} url the relative url
 * @returns {Promise} the promise that resolves to the response body content
 * @private
 */
function requestPromise(options, cb = null) {
  // setting default options
  _.defaults(options, { method: 'GET', json: true })
  return new Promise((resolve, reject) => {
    // Stubbing requests this way is easier DO NOT REFACTOR
    request[options.method.toLowerCase()](options, (err, res, body) => {
      const data = JSON.parse(body);
      if (err || res.statusCode > 299) {
        const errStr = data ? JSON.stringify(data) : ''
        reject(err || new Error(`Failed to ${options.method}, url '${options.url}': statusCode = ${res.statusCode}, err: ${errStr}`));
      } else {
        if (cb) {
          cb(data, resolve, reject);
        } else {
          return resolve(data.result.content);
        }
      }
    });
  });
}

/**
 * Makes a POST request to member service to create a new topic
 * @param  {Object} project object
 * @param  {String} notificationType notification type
 * @return {Promise}
 */
const createProjectDiscourseNotification = Promise.coroutine(
  function* (logger, projectId, title, body, tag = 'PRIMARY') {
    try {
      const token = yield getSystemUserToken();
      if (!token) {
        logger.error('Error retrieving system token')
        return Promise.reject(new Error('Error retrieving system token'))
      }
      const options = {
        url: `${config.get('API_BASE_URL')}/v4/topics/`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: {
          reference: 'project',
          referenceId: projectId.toString(),
          tag,
          title,
          body,
        },
      };
      return requestPromise(options, (data, resolve, reject) => resolve(data))
        .catch((err) => {
          logger.error(err)
        });
    } catch (err) {
      logger.error(err)
      return Promise.reject(err)
    }
  }
);

/**
 * Create notification for a project event
 * @param {Array} userIds the array of user ids
 * @param {Object} project the project
 * @param {Object} notificationTypeSubject the notification type and subject
 * @returns the notification
 * @private
 */
function createProjectNotification(userIds, project, notificationTypeSubject) {
  const params = {
    projectId: project.id,
    projectName: project.name,
    projectDescription: project.description,
  };
  const notification = {
    recipients: _.map(userIds, (id) => {
      const recipient = {
        id,
        params,
      };
      return recipient;
    }),
  };
  _.extend(notification, notificationTypeSubject);

  return notification;
}

/**
 * Get project member ids by role
 * @param {Object} project the project
 * @param {String} role the role
 * @returns {Array} the array of project member ids
 * @private
 */
function getProjectMemberIdsByRole(project, role) {
  const members = _.filter(project.members, {
    role,
  });
  return _.map(members, member => member.userId);
}

/**
 * Get project from API server
 * @param {Number} id the project id
 * @returns {Promise} the promise that resolves to the project
 * @private
 */
function* getProjectById(id) {
  const token = yield getSystemUserToken();
  if (!token) {
    logger.error('Error retrieving system token')
    return Promise.reject(new Error('Error retrieving system token'))
  }
  return yield requestPromise({
    url: `${config.get('API_BASE_URL')}/v4/projects/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Get user from API server
 * @param {Number} id the user id
 * @returns {Promise} the promise that resolves to the user
 * @private
 */
function* getUserById(id) {
  const cb = (data, resolve, reject) => {
    const user = _.get(data, 'result.content.0', null);
    if (user) {
      return resolve(user);
    }
    return reject(new Error('user not found'));
  };
  return requestPromise({url: `${config.get('API_BASE_URL')}/v3/members/_search/?query=userId:${id}`}, cb);
}


/**
 * Create notification for a project member event
 * @param {Array} userIds the array of user ids
 * @param {Object} project the project
 * @param {Object} member the member which is added or updated
 * @param {Object} notificationTypeSubject the notification type and subject
 * @returns the notification
 * @private
 */
function createProjectMemberNotification(userIds, project, member, notificationTypeSubject) {
  const params = {
    projectId: project.id,
    projectName: project.name,
    memberId: parseInt(member.id, 10),
    memberName: `${member.firstName} ${member.lastName}`,
    memberHandle: member.handle,
  };
  const notification = {
    recipients: _.map(userIds, (id) => {
      const recipient = {
        id,
        params,
      };
      return recipient;
    }),
  };
  _.extend(notification, notificationTypeSubject);

  return notification;
}

/**
 * Create notification for a slack channel
 * @param {Object} project the project
 * @returns the notification
 * @private
 */

function buildSlackNotification(project) {
  return {
    username: config.get('SLACK_USERNAME'),
    icon_url: config.get('SLACK_ICON_URL'),
    attachments: [{
      fallback: `New Project: https://connect.${config.get('AUTH_DOMAIN')}/projects/|${project.name}`,
      pretext: `New Project: https://connect.${config.get('AUTH_DOMAIN')}/projects/|${project.name}`,
      fields: [{
          title: 'Description',
          value: _.truncate(project.description, {
            length: 200,
          }),
          short: true,
        },
        {
          title: 'Ref Code',
          value: _.get(project, 'details.utm.code', ''),
          short: false,
        },
      ],
    }],
  };
}

const getSystemUserToken = Promise.coroutine(function* () {
  const formData = {
    clientId: config.get('SYSTEM_USER_CLIENT_ID'),
    secret: config.get('SYSTEM_USER_CLIENT_SECRET'),
  };
  return yield requestPromise(
    {
      method: 'POST',
      url: `${config.get('API_BASE_URL')}/v3/authorizations/`,
      form: formData,
    },
    (data, resolve, reject) => {
      return resolve(data.result.content.token);
    }
  )
})

module.exports = {
  createProjectMemberNotification,
  createProjectNotification,
  createProjectDiscourseNotification,
  getProjectMemberIdsByRole,
  getUserById,
  getProjectById,
  buildSlackNotification,
};
