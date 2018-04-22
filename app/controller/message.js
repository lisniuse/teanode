'use strict';

const Controller = require('egg').Controller;

class MessageController extends Controller {
  async index() {
    const { ctx } = this;
    const userId = ctx.user._id;
    const msgService = ctx.service.message;
    const [ readMessageResults, unReadMessageResults ] = await Promise.all([
      msgService.getReadMessagesByUserId(userId),
      msgService.getUnreadMessagesByUserId(userId),
    ]);
    const hasReadMessages = await Promise.all(readMessageResults.map(async message => await msgService.getMessageRelations(message)));
    const hasUnReadMessages = await Promise.all(unReadMessageResults.map(async message => await msgService.getMessageRelations(message)));
    
    // 把未读消息全部设置成已读
    await msgService.updateMessagesToRead(userId, unReadMessageResults);
    const tab = this.ctx.query.tab || 'all';

    let data = {has_read_messages: hasReadMessages, hasnot_read_messages: hasUnReadMessages};
    await ctx.render('message/index.html', data);
  }
}

module.exports = MessageController;