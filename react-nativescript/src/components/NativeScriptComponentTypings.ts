import { ViewBase } from "tns-core-modules/ui/core/view-base/view-base";
import { TextBase } from "tns-core-modules/ui/text-base/text-base";
import { Observable } from "tns-core-modules/data/observable";

/* Emits unreadable typings */
// export type DeepPartial<T> = {
//     [P in keyof T]?: T[P] extends Array<infer U>
//         ? Array<DeepPartial<U>>
//             : T[P] extends ReadonlyArray<infer U>
//             ? ReadonlyArray<DeepPartial<U>>
//                 : DeepPartial<T[P]>
// };


export type TextBaseProp<T extends TextBase> = {
    [P in keyof T]: T[P];
};

export type ViewBaseProp<T extends ViewBase> = {
    [P in keyof T]: T[P];
};

export type ObservableProp<T extends Observable> = {
    [P in keyof T]: T[P];
};