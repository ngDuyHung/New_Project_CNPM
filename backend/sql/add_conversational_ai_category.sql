-- Check if the category already exists
SELECT COUNT(*) INTO @count FROM categories WHERE name = 'Conversational AI';

-- Insert category if it doesn't exist
INSERT INTO categories (name, description, icon, created_at, updated_at)
SELECT 'Conversational AI', 'Practice English conversation with AI assistant', 'chat', NOW(), NOW()
WHERE @count = 0;

-- Get the ID of the category
SELECT id INTO @category_id FROM categories WHERE name = 'Conversational AI' LIMIT 1;

-- Create a default content file for the category if it doesn't exist
SELECT CONCAT('category_', @category_id, '.txt') INTO @content_file;

-- Now you can use @content_file to create a file using Node.js file operations
-- This is handled by categoryContentModel.js when the category is accessed 