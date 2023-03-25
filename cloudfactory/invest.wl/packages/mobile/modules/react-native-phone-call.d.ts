declare module 'react-native-phone-call' {

  interface Args {
    number: string;
    prompt: boolean;

  }

  export default function call(args: Args): Promise<void>;
}
