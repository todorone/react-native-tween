import { PureComponent } from 'react';
import { Animated } from 'react-native';
export declare const SPRING: typeof Animated.spring;
export declare const TIMING: (value: Animated.Value | Animated.ValueXY, config: Animated.TimingAnimationConfig) => Animated.CompositeAnimation;
export declare const DECAY: typeof Animated.decay;
interface TweenInfo {
    property: string;
    from: number | string;
    to: number | string;
    name?: string;
    type?: typeof SPRING | typeof TIMING | typeof DECAY;
    value?: any;
    interpolated?: boolean;
    duration?: number;
    delay?: number;
    autoStart?: boolean;
    active?: boolean;
}
interface Props {
    tweens: TweenInfo[];
    style?: any;
}
interface State {
    animatedStyles: Array<{}>;
}
export default class Tweenable extends PureComponent<Props, State> {
    state: State;
    tweens: Array<TweenInfo>;
    mounted: boolean;
    constructor(props: any);
    componentDidMount(): void;
    calculateAnimatedStyles(): void;
    createTween(tweenInfo: TweenInfo, reversed: boolean): any;
    createTweenComplete: (tweenInfos: TweenInfo[], onComplete: Function) => ({ finished }: {
        finished: any;
    }) => void;
    animate({ name, reversed, onComplete }?: any): void;
    parallel({ names, onComplete }: {
        names: string[];
        onComplete?: Function;
    }): void;
    render(): JSX.Element;
}
export {};
