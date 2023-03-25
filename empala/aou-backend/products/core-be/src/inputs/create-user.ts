import { Field, InputType } from 'type-graphql';
import { CreateStackInput } from './create-stack';
import { CreateTagsInput } from './create-tags';

@InputType()
export class CreateUserInput {
  /*
  coming from token for now

  @Field({ nullable: false})
  public userName: string;

  @Field({ nullable: false})
  public email: string;
  */
  @Field({ nullable: false })
  public fullName: string;

  @Field({ nullable: true })
  public bio: string;

  @Field({ nullable: true })
  public avatar: string;

  @Field(() => [CreateTagsInput], { nullable: false, description: '# AOU-524 -> AOU-82' })
  public tags: CreateTagsInput[];

  @Field(() => [CreateStackInput], { nullable: false, description: '# AOU-365 -> AOU-76' })
  public stacks: CreateStackInput[];
}
