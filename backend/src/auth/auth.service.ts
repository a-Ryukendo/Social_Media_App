import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { User } from '../users/user.schema'
import { SignupDto, LoginDto } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { username, email, password } = signupDto
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new this.userModel({ username, email, password: hashedPassword })
    await user.save()
    return { message: 'Signup successful' }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email })
    if (!user) return null
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return null
    return user
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto
    const user = await this.userModel.findOne({ email })
    if (!user) throw new UnauthorizedException('Invalid credentials')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new UnauthorizedException('Invalid credentials')
    const payload = { username: user.username, sub: user._id }
    const access_token = this.jwtService.sign(payload)
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' })
    return { access_token, refresh_token }
  }
}
