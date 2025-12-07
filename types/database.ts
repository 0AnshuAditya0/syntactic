export interface Profile {
    id: string;
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    website_url: string | null;
    github_username: string | null;
    twitter_username: string | null;
    private_key_hash: string;
    recovery_email: string | null;
    key_version: number;
    created_at: string;
    updated_at: string;
}

export interface UserPreferences {
    user_id: string;
    editor_theme: 'vs-dark' | 'vs-light' | 'hc-black' | 'github-dark' | 'monokai' | 'dracula';
    editor_font_size: number;
    editor_font_family: string;
    reading_mode: 'light' | 'dark' | 'auto';
    code_theme: string;
    email_notifications: boolean;
    show_line_numbers: boolean;
    auto_save: boolean;
    created_at: string;
    updated_at: string;
}

export interface Post {
    id: string;
    author_id: string;
    series_id: string | null;
    series_order: number | null;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
    published: boolean;
    featured: boolean;
    view_count: number;
    like_count: number;
    bookmark_count: number;
    comment_count: number;
    reading_time: number | null;
    tags: string[];
    seo_title: string | null;
    seo_description: string | null;
    og_image: string | null;
    created_at: string;
    updated_at: string;
    published_at: string | null;
}

export interface CodeFile {
    id: string;
    user_id: string | null;
    session_id: string | null;
    filename: string;
    language: 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'c';
    code: string;
    description: string | null;
    is_public: boolean;
    is_template: boolean;
    fork_count: number;
    view_count: number;
    forked_from: string | null;
    folder_path: string;
    expires_at: string | null;
    last_executed_at: string | null;
    execution_count: number;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    parent_id: string | null;
    content: string;
    is_edited: boolean;
    like_count: number;
    created_at: string;
    updated_at: string;
}

export interface Series {
    id: string;
    author_id: string;
    title: string;
    description: string | null;
    slug: string;
    cover_image: string | null;
    is_public: boolean;
    post_count: number;
    created_at: string;
    updated_at: string;
}
