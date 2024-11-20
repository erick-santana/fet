import { describe, it, expect, vi } from 'vitest'; 
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../app/services/productService.js'; 
import { productRepository } from '../app/repository/productRepository.js'; 

vi.mock('../app/repository/productRepository.js'); 

describe('Product Service', () => { 
    const mockUserAdmin = { role: 'admin' }; // Usuário mock com função de administrador
    const mockUserRegular = { role: 'user' }; // Usuário mock com função regular

    // Testa a recuperação de todos os produtos
    it('should retrieve all products', async () => {
        const mockProducts = [{ name: 'Product 1' }, { name: 'Product 2' }]; 
        productRepository.find.mockResolvedValue(mockProducts); 

        const products = await getAllProducts(); 
        expect(products).toEqual(mockProducts); 
        expect(productRepository.find).toHaveBeenCalledTimes(1); 
    });

    // Testa a recuperação de um produto por ID
    it('should retrieve a product by ID', async () => {
        const mockProduct = { name: 'Product 1' };
        const productId = '123';
        productRepository.findById.mockResolvedValue(mockProduct); 

        const product = await getProductById(productId); 
        expect(product).toEqual(mockProduct); 
        expect(productRepository.findById).toHaveBeenCalledWith(productId); 
    });

    // Testa a criação de um novo produto como administrador
    it('should create a new product as admin', async () => {
        const newProductData = { name: 'New Product' };
        productRepository.mockImplementation(() => ({ save: vi.fn().mockResolvedValue(newProductData) })); // Mock para salvar o produto

        const createdProduct = await createProduct(newProductData, mockUserAdmin); 
        expect(createdProduct).toEqual(newProductData); 
        expect(productRepository).toHaveBeenCalled(); 
    });

    // Testa a atualização de um produto como administrador
    it('should update a product as admin', async () => {
        const updatedProductData = { name: 'Updated Product' };
        const productId = '123';
        productRepository.findByIdAndUpdate.mockResolvedValue(updatedProductData); // Mock para atualizar o produto

        const updatedProduct = await updateProduct(productId, updatedProductData, mockUserAdmin); // Chama a função
        expect(updatedProduct).toEqual(updatedProductData); // Verifica se o produto atualizado é o esperado
        expect(productRepository.findByIdAndUpdate).toHaveBeenCalledWith(productId, updatedProductData, { new: true }); // Verifica a chamada do repositório
    });

    // Testa a deleção de um produto como administrador
    it('should delete a product as admin', async () => {
        const productId = '123';
        productRepository.findByIdAndDelete.mockResolvedValue(true); // Mock para deletar o produto

        const result = await deleteProduct(productId, mockUserAdmin); // Chama a função
        expect(result).toBe(true); // Verifica se a deleção foi bem-sucedida
        expect(productRepository.findByIdAndDelete).toHaveBeenCalledWith(productId); // Verifica a chamada do repositório
    });

});
