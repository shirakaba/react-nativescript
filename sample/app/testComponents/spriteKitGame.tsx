import * as React from "react";
import { PercentLength, FormattedString } from "tns-core-modules/ui/text-base/text-base";
import { Color } from "tns-core-modules/color";
import { Span } from "tns-core-modules/text/span";
import { ContentView, TextBase, ViewBase, StackLayout, Label, TabView, Page, ProxyViewContainer, Frame } from "react-nativescript/dist/client/ElementRegistry";
import { ViewProps, StylePropContents } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import {
    Button as ReactButton,
    ContentView as ReactContentView,
    TextView as ReactTextView,
    Label as ReactLabel,
    // StylePropContents,
    DockLayout as ReactDockLayout,
    AbsoluteLayout as ReactAbsoluteLayout,
    StackLayout as ReactStackLayout,
    FlexboxLayout as ReactFlexboxLayout,
    ListView as ReactListView,
    ActionBar as ReactActionBar,
    TabView as ReactTabView,
    TabViewItem as ReactTabViewItem,
    Page as ReactPage,
} from "react-nativescript/dist/index";
import * as ReactNativeScript from "react-nativescript/dist/index";
import { TabViewItem } from "tns-core-modules/ui/tab-view/tab-view";
import { PageComponentProps } from "react-nativescript/dist/components/Page";
import { DockLayoutTest, FlexboxLayoutTest, AbsoluteLayoutTest } from "./layout";
import { NavigatedData } from "tns-core-modules/ui/page/page";

const BattlefieldScene = (SKScene as any).extend(
    {
        didMoveToView: function (view){
            const indicatorHeight = 22;
            this.indicator = SKSpriteNode.alloc().initWithColorSize(
                UIColor.alloc().initWithRedGreenBlueAlpha(0,1,0,1),
                CGSizeMake(this.frame.size.width, indicatorHeight)
            );
            this.indicator.position = CGPointMake(
                // The origin of the SKSpriteNode is at the midpoint rather than corner
                this.frame.size.width / 2,
                // this.frame.size.height - (indicatorHeight / 2)
                0 + (indicatorHeight / 2)
            );
            this.addChild(this.indicator);

            const heroSize = CGSizeMake(25, 25);
            this.hero = SKSpriteNode.alloc().initWithColorSize(
                UIColor.alloc().initWithRedGreenBlueAlpha(0,0,1,1),
                heroSize
            );

            const heroPhysicsBody = SKPhysicsBody.bodyWithRectangleOfSize(heroSize);
            // heroPhysicsBody.affectedByGravity = true;
            heroPhysicsBody.allowsRotation = true;
            heroPhysicsBody.allowsRotation = true;
            heroPhysicsBody.usesPreciseCollisionDetection = false;

            this.hero.physicsBody = heroPhysicsBody;
            this.heroHitCategory = 1;
            this.villainHitCategory = 2;
            this.hero.physicsBody.categoryBitMask = this.heroHitCategory;
            this.hero.physicsBody.contactTestBitMask = this.villainHitCategory;
            this.hero.physicsBody.collisionBitMask = this.villainHitCategory;

            const villainSize = CGSizeMake(50, 50);
            this.villain = SKSpriteNode.alloc().initWithColorSize(
                UIColor.alloc().initWithRedGreenBlueAlpha(1,0,0,1),
                villainSize
            );

            const villainPhysicsBody = SKPhysicsBody.bodyWithRectangleOfSize(villainSize);
            // villainPhysicsBody.affectedByGravity = true;
            villainPhysicsBody.allowsRotation = true;
            villainPhysicsBody.allowsRotation = true;
            villainPhysicsBody.usesPreciseCollisionDetection = false;

            this.villain.physicsBody = villainPhysicsBody;
            this.villain.physicsBody.categoryBitMask = this.villainHitCategory;
            this.villain.physicsBody.contactTestBitMask = this.heroHitCategory;
            this.villain.physicsBody.collisionBitMask = this.heroHitCategory;

            this.hero.position = CGPointMake(
                CGRectGetMidX(this.frame),
                3 * (CGRectGetMidY(this.frame) / 2),
            );

            this.villain.position = CGPointMake(
                CGRectGetMidX(this.frame),
                CGRectGetMidY(this.frame) / 2,
            );
            
            this.heroTargetPos = this.hero.position;
            this.heroBaseSpeed = 5 / 1.5;
            this.villainBaseSpeed = 3 / 1.5;

            this.addChild(this.hero);
            this.addChild(this.villain);

            this.physicsWorld.gravity = {
                dx: 0,
                dy: 0,
            };
            /* SKPhysicsContactDelegate */
            this.physicsWorld.contactDelegate = this;
        },

        diffFn: function(baseSpeed, currentPos, targetPos, deltaTime, currentRotationInRadians){
            /* origin */
            const xDiff = targetPos.x - currentPos.x;
            const yDiff = targetPos.y - currentPos.y;

            const angleInRadians = Math.atan2(yDiff, xDiff);
            const speed = baseSpeed / (1000 / deltaTime);
            const maxAdvanceX = Math.cos(angleInRadians) * (speed * deltaTime);
            const maxAdvanceY = Math.sin(angleInRadians) * (speed * deltaTime);

            const x = xDiff >= 0 ?
                Math.min(currentPos.x + maxAdvanceX, targetPos.x) :
                Math.max(currentPos.x + maxAdvanceX, targetPos.x);
            const y = yDiff >= 0 ?
                Math.min(currentPos.y + maxAdvanceY, targetPos.y) :
                Math.max(currentPos.y + maxAdvanceY, targetPos.y);
            /***********/

            /* rotation */
            // Sprites rotate around midpoint by default: https://stackoverflow.com/questions/40076814/how-to-rotate-sknode-in-swift
            // Example maths: https://stackoverflow.com/questions/19390064/how-to-rotate-a-sprite-node-in-sprite-kit
            // Docs: https://developer.apple.com/documentation/spritekit/sknode/1483089-zrotation?language=objc
            const degToRad = Math.PI / 180;
            const radToDeg = 180 / Math.PI;
            // We'll convert to degrees and calculate as such
            const extraRotation = (angleInRadians * radToDeg) - (currentRotationInRadians * radToDeg);
            const easing = 4;

            const optimalRotation = extraRotation < -180 ?
                360 + extraRotation :
                (
                    extraRotation > 180 ?
                        extraRotation - 360 :
                        extraRotation
                );
            const optimalEasedRotation = optimalRotation / easing;
            const newRotationInDegrees = (currentRotationInRadians + optimalEasedRotation) % 360;
            // zRotation is in radians
            /***********/

            return {
                point: CGPointMake(x, y),
                rotation: newRotationInDegrees * degToRad
            }
        },

        update: function(currentTime){
            /* Somehow not working: https://stackoverflow.com/questions/33818362/is-there-a-way-to-read-get-fps-in-spritekit-swift */
            // const deltaTime = currentTime - (this.lastUpdateTime ? this.lastUpdateTime : currentTime - 0.06);
            // const currentFPS = 1 / deltaTime;
            // this.lastUpdateTime = currentTime;

            const idealDeltaTime = 60;
            const idealFPS = 0.0166666;

            /* Close the gap with the hero within one second */
            // const vPos = this.villain.position;
            // const hPos = this.hero.position;
            // this.villain.position = CGPointMake(
            //     vPos.x - ((vPos.x - hPos.x) * idealFPS),
            //     vPos.y - ((vPos.y - hPos.y) * idealFPS)
            // );

            const forVillain = this.diffFn(this.villainBaseSpeed, this.villain.position, this.hero.position, idealDeltaTime, this.villain.zRotation);
            const forHero = this.diffFn(this.heroBaseSpeed, this.hero.position, this.heroTargetPos, idealDeltaTime, this.hero.zRotation);

            this.villain.zRotation = forVillain.rotation;
            /* Villain should only rotate if it's moving... but can't be bothered to solve precision issues */
            // if(this.villain.position.x !== forVillain.point.x || this.villain.position.y !== forVillain.point.y){
                this.villain.position = forVillain.point;
            // }

            this.hero.position = forHero.point;
            
            /* Hero should only rotate if it's moving... but can't be bothered to solve precision issues */
            // if(this.hero.position.x !== forHero.point.x || this.hero.position.y !== forHero.point.y){
                this.hero.zRotation = forVillain.rotation;
            // }
        },


        // touchesEndedWithEvent(touches: NSSet<UITouch>, event: _UIEvent): void;
        touchesEndedWithEvent: function (touches, event){
            // Synchronous
            touches.enumerateObjectsUsingBlock((touch, i) => {
                const location = touch.locationInNode(this);
                // if(this.button.containsPoint(location)){
                //     this.button.color = UIColor.alloc().initWithRedGreenBlueAlpha(0,0,1,1);
                // } else {
                //     this.button.color = UIColor.alloc().initWithRedGreenBlueAlpha(0,1,0,1);
                // }

                /* Close gap with target in one second */
                // this.hero.runActionCompletion(
                //     SKAction.moveToDuration(CGPointMake(location.x, location.y), 1),
                //     () => {
                //         this.indicator.color = UIColor.alloc().initWithRedGreenBlueAlpha(0,1,1,1);
                //     }
                // );

                this.heroTargetPos = location;
            });
        },

        /* SKPhysicsContactDelegate */
        didBeginContact: function(contact){
            if(
                contact.bodyA.categoryBitMask === this.villainHitCategory || 
                contact.bodyB.categoryBitMask === this.villainHitCategory
            ){
                this.indicator.color = UIColor.alloc().initWithRedGreenBlueAlpha(1,0,0,1);
            }
        },
        /* SKPhysicsContactDelegate */
        didEndContact: function(contact){
            if(
                contact.bodyA.categoryBitMask === this.villainHitCategory || 
                contact.bodyB.categoryBitMask === this.villainHitCategory
            ){
                this.indicator.color = UIColor.alloc().initWithRedGreenBlueAlpha(0,1,0,1);
            }
        }
    },
    {
        name: "BattlefieldScene",
        protocols: [SKPhysicsContactDelegate]
    }
);
// BattlefieldScene.alloc().initWithSize(design.ios.bounds.size);

// https://stackoverflow.com/questions/53104428/spritekit-example-without-storyboard
const GameViewController = (UIViewController as any).extend(
    {
        get willPopCb() { return this._willPopCb; },
        set willPopCb(x) { this._willPopCb = x; },
        viewDidLoad: function(){
            UIViewController.prototype.viewDidLoad.apply(this, arguments);

            this.view = SKView.alloc().initWithFrame(this.view.bounds);
            if(this.view instanceof SKView){
                const scene = BattlefieldScene.alloc().initWithSize(
                    this.view.bounds.size
                );
                // scene.view.backgroundColor = UIColor.alloc().initWithRedGreenBlueAlpha(0,1,0,1);

                scene.scaleMode = SKSceneScaleMode.AspectFill;

                this.view.presentScene(scene);
                this.view.showsPhysics = false;
                this.view.ignoresSiblingOrder = true;
                this.view.showsFPS = true;
                this.view.showsNodeCount = true;
            }
        },
        willMoveToParentViewController: function(parent: UIViewController|null){
            // https://stackoverflow.com/questions/5217992/back-button-callback-in-navigationcontroller-in-ios
            if(parent === null){
                if(this.willPopCb){
                    this.willPopCb();
                }
            }
        }
    },
    {
        name: "GameViewController",
        protocols: [],
        exposedMethods: {}
    }
);

function getUIViewController(uiresponder: UIResponder): UIResponder|null {
    for(let responder = uiresponder; responder !== null && typeof responder !== "undefined"; responder = responder.nextResponder){
        if(responder instanceof UIViewController) return responder;
    }
    return null;
}

// const vc = getUIViewController(design.ios);
// if(vc !== null){
//     vc.presentViewControllerAnimatedCompletion(
//         gameVC,
//         true,
//         () => {}
//     );
// }

/**
 * Load audio into an AVAudioPlayer and store it in a strong reference.
 * @param url - URL to the local audio file
 * @param strongRef - seems that a local variable holding 'player' can be dealloced while returning
 *                    from this function, so instead we take an object with a 'player' property.
 */
function loadAudioFromDownloadedFile(url: NSURL, strongRef: { player?: AVAudioPlayer }): void {
    console.log(`Will create player from url:`, url);
    try {
        AVAudioSession.sharedInstance().setCategoryError(AVAudioSessionCategoryPlayAndRecord);
        strongRef.player = AVAudioPlayer.alloc().initWithContentsOfURLFileTypeHintError(
            url,
            AVFileTypeMPEGLayer3
        );
        if(strongRef.player === null){
            console.error(`Got a null player back.`);
            return null;
        } else {
            console.log(`Player successfully inited.`);
        }
        // const playerItem = AVPlayerItem.alloc().initWithURL(url);
        // strongRef.player = AVPlayer.alloc().initWithPlayerItem(playerItem);
    } catch(error){
        // The error is a JS error, not an NSError.
        console.error(error.toString());
        return null;
    }
    // if(strongRef.player instanceof AVAudioPlayer){
        strongRef.player.prepareToPlay();
    // }
    strongRef.player.numberOfLoops = -1; // loop forever
    strongRef.player.volume = 1.0;
}

// With reference to: https://stackoverflow.com/questions/28290458/xcode-download-mp3-file
function downloadFileFromURL(url: NSURL): Promise<NSURL> {
    const directoryURL: NSURL = NSFileManager.defaultManager.URLsForDirectoryInDomains(NSSearchPathDirectory.DocumentDirectory, NSSearchPathDomainMask.UserDomainMask).firstObject;
    const destinationUrl: NSURL = directoryURL.URLByAppendingPathComponent(url.lastPathComponent);
    
    return new Promise((resolve, reject) => {
        if(NSFileManager.defaultManager.fileExistsAtPath(destinationUrl.path)){
            return resolve(destinationUrl);
        }

        NSURLSession.sharedSession.downloadTaskWithURLCompletionHandler(
            url,
            (urlB, response, error) => {
                console.log(`Got response.statusCode:`, (response as any).statusCode);

                if(error) return reject(error.code.toString());

                try {
                    NSFileManager.defaultManager.moveItemAtURLToURLError(urlB, destinationUrl);                
                } catch(moveError){
                    return reject((moveError as Error));
                }

                return resolve(destinationUrl);
            }
        ).resume();
    });
}


export class SpriteKitGameTest extends React.Component<{ innerRef: React.RefObject<Page> } & PageComponentProps, { audioLoaded: boolean }> {
    private playerStrongRef: { player?: AVAudioPlayer } = {};
    private readonly gameVC: UIViewController = GameViewController.alloc().init();

    constructor(props){
        super(props);

        this.state = { audioLoaded: false };
    }

    componentDidMount(){
        downloadFileFromURL(
            NSURL.alloc().initWithString("https://birchlabs.co.uk/blog/alex/juicysfplugin/synth/cpp/2019/01/05/TheBox_compressed_less.mp3")
        )
        .then((audioURL: NSURL) => {
            console.log(`Got audioURL:`, audioURL);
            loadAudioFromDownloadedFile(audioURL, this.playerStrongRef);
            this.setState({ audioLoaded: true });
        })
        .catch(console.error);
    }

    render(){
        const { innerRef, ...rest } = this.props;

        return (
            <ReactPage innerRef={innerRef} actionBarHidden={false} {...rest}>
                <ReactActionBar title="Navigation Hub" className="action-bar" />
                <ReactStackLayout>
                    <ReactLabel text={`Audio loaded: ${this.state.audioLoaded}`}/>
                    <ReactButton
                        text={"Launch SpriteKit game (with audio)!"}
                        onPress={() => {
                            if(this.playerStrongRef.player) this.playerStrongRef.player.play();

                            const currentPage: Page = innerRef.current!;
                            const currentFrame: Frame = currentPage.frame;
                            const nc: UINavigationController = currentFrame.ios.controller;
                            (this.gameVC as any).willPopCb = () => this.playerStrongRef.player && this.playerStrongRef.player.stop();
                            nc.pushViewControllerAnimated(this.gameVC, true);
                        }}
                    />
                </ReactStackLayout>
            </ReactPage>
        );
    }
}
