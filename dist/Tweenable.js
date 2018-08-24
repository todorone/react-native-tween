"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var translateProperties = [
    'perspective', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX',
    'scaleY', 'skewX', 'skewY', 'translateX', 'translateY',
];
exports.SPRING = react_native_1.Animated.spring;
exports.TIMING = react_native_1.Animated.timing;
exports.DECAY = react_native_1.Animated.decay;
var Tweenable = /** @class */ (function (_super) {
    __extends(Tweenable, _super);
    function Tweenable(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { animatedStyles: [] };
        _this.tweens = [];
        _this.mounted = false;
        // Animations are processed only before component mount, otherwise
        // adjusting animations props will lead to ruining current animations state
        _this.tweens = props.tweens.map(function (t) { return ({
            name: t.name || 'default',
            type: t.type || react_native_1.Animated.spring,
            property: t.property,
            from: t.from,
            to: t.to,
            duration: t.duration,
            delay: t.delay,
            autoStart: t.autoStart === undefined ? true : t.autoStart,
            onComplete: t.onComplete,
            onReversedComplete: t.onReversedComplete,
            value: new react_native_1.Animated.Value(typeof t.from === 'string' ? 0 : t.from),
            interpolated: typeof t.from === 'string',
            active: false,
        }); });
        var startingAnimations = [];
        _this.tweens.forEach(function (_a) {
            var name = _a.name, autoStart = _a.autoStart;
            if (autoStart)
                startingAnimations.push(name);
        });
        startingAnimations.forEach(function (name) { return _this.animate({ name: name }); });
        return _this;
    }
    Tweenable.prototype.componentDidMount = function () {
        this.mounted = true;
    };
    Tweenable.prototype.calculateAnimatedStyles = function () {
        var animatedStyles = [];
        this.tweens.forEach(function (tween) {
            var _a, _b;
            if (tween.active) {
                var styleValue = tween.interpolated
                    ? tween.value.interpolate({
                        inputRange: [0, 1],
                        outputRange: [tween.from, tween.to],
                    })
                    : tween.value;
                animatedStyles.push(translateProperties.includes(tween.property)
                    ? { transform: [(_a = {}, _a[tween.property] = styleValue, _a)] }
                    : (_b = {}, _b[tween.property] = styleValue, _b));
            }
        });
        if (this.mounted) {
            this.setState({ animatedStyles: animatedStyles });
        }
        else {
            this.state.animatedStyles = animatedStyles;
        }
    };
    Tweenable.prototype.animate = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.name, name = _c === void 0 ? 'default' : _c, _d = _b.reversed, reversed = _d === void 0 ? false : _d;
        var animationInfo = this.tweens.find(function (t) { return t.name === name; });
        if (animationInfo) {
            var type = animationInfo.type, from = animationInfo.from, to = animationInfo.to, duration = animationInfo.duration, value = animationInfo.value, onComplete_1 = animationInfo.onComplete, interpolated = animationInfo.interpolated, delay = animationInfo.delay, onReversedComplete_1 = animationInfo.onReversedComplete; // prettier-ignore
            animationInfo.active = true;
            this.calculateAnimatedStyles();
            value.setValue(reversed ? (interpolated ? 1 : to) : (interpolated ? 0 : from)); // prettier-ignore
            // @ts-ignore
            var mainAnimation = type(value, {
                toValue: reversed ? (interpolated ? 0 : from) : (interpolated ? 1 : to),
                duration: duration,
                useNativeDriver: true,
            });
            var onAnimationComplete = function (_a) {
                var finished = _a.finished;
                if (finished) {
                    animationInfo.active = false;
                    if (reversed) {
                        onReversedComplete_1 && onReversedComplete_1();
                    }
                    else {
                        onComplete_1 && onComplete_1();
                    }
                }
            };
            if (delay) {
                react_native_1.Animated.sequence([
                    react_native_1.Animated.delay(delay),
                    mainAnimation
                ]).start(onAnimationComplete);
            }
            else {
                mainAnimation.start(onAnimationComplete);
            }
        }
        else {
            throw Error('Animation is not found');
        }
    };
    Tweenable.prototype.render = function () {
        return (react_1.default.createElement(react_native_1.Animated.View, { style: [this.props.style].concat(this.state.animatedStyles) }, this.props.children));
    };
    return Tweenable;
}(react_1.PureComponent));
exports.default = Tweenable;
