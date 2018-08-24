import { PureComponent } from 'react';
import { Animated } from 'react-native';
export declare const SPRING: typeof Animated.spring;
export declare const TIMING: (value: Animated.Value | Animated.ValueXY, config: Animated.TimingAnimationConfig) => Animated.CompositeAnimation;
export declare const DECAY: typeof Animated.decay;
interface Tween {
    name?: string;
    type?: typeof SPRING | typeof TIMING | typeof DECAY;
    property: string;
    from: number | string;
    to: number | string;
    value?: any;
    interpolated?: boolean;
    duration?: number;
    autoStart?: boolean;
    onComplete?: () => void;
    onReversedComplete?: () => void;
    active?: boolean;
}
interface Props {
    tweens: Array<Tween>;
    style?: any;
}
interface State {
    animatedStyles: Array<{}>;
}
export default class Tweenable extends PureComponent<Props, State> {
    state: State;
    tweens: Array<Tween>;
    mounted: boolean;
    constructor(props: any);
    componentDidMount(): void;
    calculateAnimatedStyles(): void;
    animate({ name, reversed, }?: {
        name?: string;
        reversed?: boolean;
    }): void;
    render(): JSX.Element;
}
export {};
