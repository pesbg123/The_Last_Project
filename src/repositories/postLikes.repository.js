const { PostLikes, Posts, Users } = require('../models');

class PostLikesRepository {
  // 게시글 상세 조회 임시 테스트
  getPost = async (post_id) => {
    const post = await Posts.findOne({ where: { id: post_id } });
    return post;
  };
  // 이미 좋아요를 눌렀는지 조회
  getPostLike = async (post_id, user_id) => {
    return await PostLikes.findOne({ where: { post_id, user_id } });
  };

  async addPostLike(post_id, user_id) {
    return await PostLikes.create({ post_id, user_id });
  }

  async removePostLike(post_id, user_id) {
    return await PostLikes.destroy({ where: { post_id, user_id } });
  }

  async getUserLikedPosts(user_id, page) {
    try {
      let offset = 0;
      const limit = 20;

      if (page > 1) {
        offset = limit * (page - 1);
      }

      const likedPosts = await PostLikes.findAll({
        where: { user_id },
        include: [{ model: Posts, include: [{ model: Users, attributes: ['nickname'] }] }],
        limit,
        offset,
        order: [['created_at', 'DESC']],
      });

      const likedPostsCount = await PostLikes.count({ where: { user_id } });

      return {
        likedPosts,
        likedPostsCount,
      };
    } catch (error) {
      throw error;
    }
  }

  async postLikeCountIncrease(like, post_id) {
    return Posts.update({ like }, { where: { post_id  } });
  }
}

module.exports = PostLikesRepository;
