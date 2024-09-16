const PointCriteria = require('../models/point_criteria');

// 포인트 획득 및 차감 기준 등록
exports.createPointCriteria = async (req, res) => {
  try {
    const { content, remark, points } = req.body;

    if (!content || !points) {
      return res.status(400).json({ message: '필수 항목이 누락되었습니다.' });
    }

    const newCriteria = await PointCriteria.create({
      content,
      remark,
      points,
    });

    return res.status(201).json({
      message: '포인트 획득 기준이 성공적으로 등록되었습니다.',
      data: newCriteria,
    });
  } catch (error) {
    console.error('포인트 기준 등록 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
};

// 포인트 획득 및 차감 기준 수정
exports.updatePointCriteria = async (req, res) => {
  try {
    const { criteria_id } = req.params;
    const { content, remark, points } = req.body;

    const criteria = await PointCriteria.findByPk(criteria_id);

    if (!criteria) {
      return res.status(404).json({ message: '포인트 획득 기준을 찾을 수 없습니다.' });
    }

    // 필드 업데이트
    await criteria.update({
      content: content || criteria.content,
      remark: remark || criteria.remark,
      points: points || criteria.points,
    });

    return res.status(200).json({
      message: '포인트 획득 기준이 성공적으로 수정되었습니다.',
      data: criteria,
    });
  } catch (error) {
    console.error('포인트 기준 수정 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
};

// 포인트 획득 및 차감 기준 삭제
exports.deletePointCriteria = async (req, res) => {
  try {
    const { criteria_id } = req.params;

    const criteria = await PointCriteria.findByPk(criteria_id);

    if (!criteria) {
      return res.status(404).json({ message: '포인트 획득 기준을 찾을 수 없습니다.' });
    }

    await criteria.destroy();

    return res.status(200).json({ message: '포인트 획득 기준이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('포인트 기준 삭제 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
};
