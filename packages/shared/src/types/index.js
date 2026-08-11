"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportStatus = exports.ReportTargetType = exports.NotificationType = exports.MessageType = exports.FollowStatus = exports.PostType = exports.MediaType = exports.AspectRatio = exports.AccountStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MODERATOR"] = "MODERATOR";
})(UserRole || (exports.UserRole = UserRole = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["SUSPENDED"] = "SUSPENDED";
    AccountStatus["DEACTIVATED"] = "DEACTIVATED";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var AspectRatio;
(function (AspectRatio) {
    AspectRatio["SQUARE"] = "1:1";
    AspectRatio["PORTRAIT"] = "4:5";
    AspectRatio["LANDSCAPE"] = "16:9";
    AspectRatio["STORY"] = "9:16";
})(AspectRatio || (exports.AspectRatio = AspectRatio = {}));
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "IMAGE";
    MediaType["VIDEO"] = "VIDEO";
})(MediaType || (exports.MediaType = MediaType = {}));
var PostType;
(function (PostType) {
    PostType["IMAGE"] = "IMAGE";
    PostType["VIDEO"] = "VIDEO";
    PostType["CAROUSEL"] = "CAROUSEL";
    PostType["TEXT"] = "TEXT";
})(PostType || (exports.PostType = PostType = {}));
var FollowStatus;
(function (FollowStatus) {
    FollowStatus["ACCEPTED"] = "ACCEPTED";
    FollowStatus["PENDING"] = "PENDING";
})(FollowStatus || (exports.FollowStatus = FollowStatus = {}));
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "TEXT";
    MessageType["IMAGE"] = "IMAGE";
    MessageType["VIDEO"] = "VIDEO";
    MessageType["VOICE"] = "VOICE";
    MessageType["GIF"] = "GIF";
    MessageType["POST_SHARE"] = "POST_SHARE";
    MessageType["PROFILE_SHARE"] = "PROFILE_SHARE";
    MessageType["LOCATION"] = "LOCATION";
})(MessageType || (exports.MessageType = MessageType = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["LIKE"] = "LIKE";
    NotificationType["COMMENT"] = "COMMENT";
    NotificationType["FOLLOW"] = "FOLLOW";
    NotificationType["FOLLOW_REQUEST"] = "FOLLOW_REQUEST";
    NotificationType["FOLLOW_ACCEPT"] = "FOLLOW_ACCEPT";
    NotificationType["MENTION"] = "MENTION";
    NotificationType["STORY_REACTION"] = "STORY_REACTION";
    NotificationType["STORY_REPLY"] = "STORY_REPLY";
    NotificationType["MESSAGE"] = "MESSAGE";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var ReportTargetType;
(function (ReportTargetType) {
    ReportTargetType["POST"] = "POST";
    ReportTargetType["USER"] = "USER";
    ReportTargetType["COMMENT"] = "COMMENT";
})(ReportTargetType || (exports.ReportTargetType = ReportTargetType = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "PENDING";
    ReportStatus["RESOLVED"] = "RESOLVED";
    ReportStatus["DISMISSED"] = "DISMISSED";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
