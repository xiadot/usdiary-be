const {diaries, Diary} = require('../models');

exports.diaryList = (req, res) => {
    res.render(diaries, { title: '일기 목록'});
}

exports.renderMain = async (req, res, next) => {
    try{
        const diaries = await post.findAll({
            include: {
                model: Diary,
                attributes: [ 'user_id', 'board_id'],
            },
            order: [['createAt', 'DESC']],
        });
        res.render('diaries', {
            title: 'usdiary',
            diary: diaries,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}