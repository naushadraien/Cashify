import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserIdParamDto } from "./dto/user-id-param.dto";
import { UserSearchQueryDto } from "./dto/user-search-query.dto";

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "Get the current user's full profile" })
  me(@CurrentUser() user: { id: string }) {
    return this.usersService.getById(user.id);
  }

  @Patch("me")
  @ApiOperation({ summary: "Update name and/or avatar" })
  @ApiResponse({ status: 200, description: "Updated profile" })
  updateMe(
    @CurrentUser() user: { id: string },
    @Body() body: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, body);
  }

  @Delete("me")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Permanently delete the current account and all linked sessions",
  })
  deleteMe(@CurrentUser() user: { id: string }) {
    return this.usersService.deleteAccount(user.id);
  }

  // NOTE: this MUST be declared before the `:id` route below -- Nest/Express
  // match routes in declaration order, so `GET /users/search` would
  // otherwise be swallowed by `GET /users/:id` with `id` bound to the
  // literal string "search".
  @Get("search")
  @ApiOperation({
    summary: "Search users by exact email or partial (case-insensitive) name",
  })
  @ApiQuery({
    name: "name",
    required: false,
    description: "Partial, case-insensitive match",
  })
  @ApiQuery({
    name: "email",
    required: false,
    description: "Exact match only -- no partial email search",
  })
  @ApiResponse({ status: 200, description: "Up to 20 matching users" })
  @ApiResponse({
    status: 400,
    description:
      "Neither name nor email provided, or email is not validly formatted",
  })
  search(@Query() query: UserSearchQueryDto) {
    return this.usersService.search(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user by id" })
  @ApiParam({ name: "id", description: "UUID" })
  @ApiResponse({ status: 200, description: "The matching user" })
  @ApiResponse({ status: 400, description: "id is not a valid UUID" })
  @ApiResponse({ status: 404, description: "No user with that id" })
  findById(@Param() params: UserIdParamDto) {
    return this.usersService.getById(params.id);
  }
}
