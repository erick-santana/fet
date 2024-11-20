import { registerUser, updateUser, getUser, deleteUser } from '../app/services/userService';
import { userRepository } from '../app/repository/userRepository';
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('../app/repository/userRepository');

describe('user', () => {
    afterEach(() => {
        vi.restoreAllMocks()
      })

    it('should return an error if user already exists', async () => {
        const user = {
            email: 'test@example.com',
            password: 'password123',
        };

        userRepository.findOne.mockResolvedValue({ email: 'test@example.com' });

        const result = await registerUser(user);

        expect(result).toEqual({ error: 'User already exists' });
        expect(userRepository.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should create a new user if user does not exist', async () => {
        const user = {
            email: 'test@example.com',
            password: 'password123',
        };

        userRepository.findOne.mockResolvedValue(null);
        userRepository.create.mockResolvedValue({ id: '123', ...user });
        
        const result = await registerUser(user);

        expect(result.email).toEqual(user.email);
        expect(userRepository.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(userRepository.create).toHaveBeenCalledWith(user);
    });

    it('should return an error if an error occurs during registration', async () => {
        const user = {
            email: 'test@example.com',
            password: 'password123',
        };

        userRepository.findOne.mockRejectedValue(new Error('Database error'));

        const result = await registerUser(user);

        expect(result).toEqual({ error: 'Registration failed' });
        expect(userRepository.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should update the user', async () => {
        const user = {
            id: '123',
            email: 'test@example.com',
            password: 'newpassword123',
        };
    
        userRepository.findByIdAndUpdate.mockResolvedValue(user);
    
        const result = await updateUser(user);
    
        expect(result).toEqual(user);
        expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(user.id, user);
    });

    it('should delete the user', async () => {
        const userId = '123';
    
        userRepository.findByIdAndDelete.mockResolvedValue({ id: userId });
    
        const result = await deleteUser(userId);
    
        expect(result).toEqual({ id: userId });
        expect(userRepository.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });

    it('should get the user by id', async () => {
        const userId = '123';
        const user = {
            id: userId,
            email: 'test@example.com',
            password: 'password123',
        };
    
        userRepository.findById.mockResolvedValue(user);
    
        const result = await getUser(userId);
    
        expect(result).toEqual(user);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
});
