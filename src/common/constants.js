/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */

/**
 * This file defines constant values
 * @author TCSCODER
 * @version 1.0
 */
module.exports = {
  // The event types to be consumed from the source RabbitMQ
  events: {
    projectDraftCreated: 'project.draft-created',
    projectUpdated: 'project.updated',
    projectMemberAdded: 'project.member.added',
    projectMemberRemoved: 'project.member.removed',
    projectMemberUpdated: 'project.member.updated',
    projectUnclaimed: 'project.copilot-unclaimed',
  },
  // The notification types to be produce to the target RabbitMQ
  notifications: {
    discourse: {
      project: {
        created: {
          title: 'Your project has been created, and we\'re ready for your specification',
          content: (data) => `Hello, Coder here! Your project '${data.projectName}' has been created successfully. For your next step, please head over to the <a href="${data.projectUrl}specification/" rel="nofollow">Specification</a> section and answer all of the required questions. If you already have a document with your requirements, just verify it against our checklist and then upload it. Once you're done, hit the "Submit for Review" button on the Specification. Get stuck or need help? Email us at <a href="mailto:support@topcoder.com?subject=Question%20Regarding%20My%20New%20Topcoder%20Connect%20Project" rel="nofollow">support@topcoder.com</a>.`,
        },
        submittedForReview: {
          title: 'Your project has been submitted for review',
          content: (data) => `Hello, it's Coder again. Thanks for submitting your project <a href="${data.projectUrl}" rel="nofollow">${data.projectName}</a>! I've used my super computational powers to route it to one of our trusty humans. They'll get back to you in 1-2 business days.`,
        },
        activated: {
          title: 'Work on your project has begun',
          content: (data) => `Good news, everyone! Work on project ${data.projectName} has kicked off. Please keep an eye on the <a href="${data.projectUrl}" rel="nofollow">Dashboard</a> section (or your email inbox) for the latest status updates.`,
        },
        canceled: {
          title: 'Your project has been canceled',
          content: (data) => `Project <a href="${data.projectUrl}" rel="nofollow">${data.projectName}</a> has been canceled. If you think this may have been a mistake, please reply to this message immediately. Otherwise, looking forward to your next project. Coder signing off....`,
        },
        completed: {
          title: 'Your project has been completed',
          content: (data) => `Project <a href="${data.projectUrl}" rel="nofollow">${data.projectName}</a> is finished! Well done, team. Looking forward to seeing your next project soon. Coder signing off....`,
        },
      },
      teamMembers: {
        added: {
          title: 'A new team member has joined your project',
          content: (data) => `${data.firstName} ${data.lastName} has joined project <a href="${data.projectUrl}" rel="nofollow">${data.projectName}</a>. Welcome ${data.firstName}! Looking forward to working with you.`,
        },
        managerJoined: {
          title: 'A Topcoder project manager has joined your project',
          content: (data) => `${data.firstName} ${data.lastName} has joined your project <a href="${data.projectUrl}" rel="nofollow">${data.projectName}</a> as a project manager.`,
        },
        copilotJoined: {
          title: 'A Topcoder copilot has joined your project',
          content: (data) => `${data.firstName} ${data.lastName} has joined your project <a href="${data.projectUrl}" rel="nofollow">${data.projectName}</a> as a copilot.`,
        },
        left: {
          title: 'A team member has left your project',
          content: (data) => `${data.firstName} ${data.lastName} has left project <a href="${data.projectUrl}" rel="nofollow">${data.projectName}</a>. Thanks for all your work ${data.firstName}.`,
        },
        removed: {
          title: 'A team member has left your project',
          content: (data) => `${data.firstName} ${data.lastName} has left project <a href="${data.projectUrl}" rel="nofollow">${data.projectName}</a>. Thanks for all your work ${data.firstName}.`,
        },
        ownerChanged: {
          title: 'Your project has a new owner',
          content: (data) => `${data.firstName} ${data.lastName} is now responsible for project <a href="${data.projectUrl}" rel="nofollow">${data.projectName}</a>. Good luck ${data.firstName}.`,
        },
      },
    },
    project: {
      created: { notificationType: 'Project.Created', subject: 'Created' },
      submittedForReview: { notificationType: 'Project.SubmittedForReview', subject: 'Submitted for review' },
      availableForReview: { notificationType: 'Project.AvailableForReview', subject: 'Available for review' },
      reviewed: { notificationType: 'Project.Reviewed', subject: 'Reviewed' },
      availableToClaim: { notificationType: 'Project.AvailableToClaim', subject: 'Reviewed - Available to claim' },
    },
    teamMember: {
      added: { notificationType: 'Project.Member.Added', subject: 'Member added' },
      managerJoined: { notificationType: 'Project.Member.ManagerJoined', subject: 'Manager joined' },
      copilotJoined: { notificationType: 'Project.Member.CopilotJoined', subject: 'Copilot joined' },
      removed: { notificationType: 'Project.Member.Removed', subject: 'Member removed' },
      left: { notificationType: 'Project.Member.Left', subject: 'Member left' },
      ownerChanged: { notificationType: 'Project.Member.OwnerChanged', subject: 'Ownership changed' },
    },
  },
  projectStatuses: {
    draft: 'draft',
    inReview: 'in_review',
    reviewed: 'reviewed',
    active: 'active',
    canceled: 'cancelled', // spelling is not a type :)
    completed: 'completed',
  },
  memberRoles: {
    manager: 'manager',
    customer: 'customer',
    copilot: 'copilot',
  },
};
