const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/memberController');

router.get('/members', MemberController.getMembers);
router.get('/members/:id', MemberController.getMemberById);
router.get('/groups/:groupID/members', MemberController.getMembersByGroupId);
router.post('/members', MemberController.createMember);
router.put('/members/:id', MemberController.updateMember);
router.delete('/members/:id', MemberController.deleteMember);

module.exports = router;
